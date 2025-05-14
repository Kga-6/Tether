
import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

// Utility: generate 3-char alphanumeric parts
const generatePairCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part = () =>
    Array.from({ length: 3 })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
  return `${part()}-${part()}`;
};

interface UserData {
  uid: string;
  pair_code: string;
  partner_uid: string | null;
  partner_welcomed?: boolean;
  name?: string | null;
  email?: string | null;
}

/**
 * Pair two users by their pairing codes.
 * Expects req.data.partnerCode (string).
 */

export const pairUsers = onCall({ region: "us-central1" }, async (req) => {
  // 1. Auth check
  const auth = req.auth;
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Must be called while authenticated.");
  }
  const callerUid = auth.uid;

  // 2. Input validation
  const partnerCodeToPairWith = (req.data as any).partnerCode;
  if (!partnerCodeToPairWith || typeof partnerCodeToPairWith !== "string") {
    throw new HttpsError("invalid-argument", "Missing or invalid 'partnerCode'.");
  }

  // 3. Transactional pairing
  try {
    const result = await db.runTransaction(async (tx) => {
      const callerRef = db.collection("users").doc(callerUid);
      const callerSnap = await tx.get(callerRef);
      if (!callerSnap.exists) {
        throw new HttpsError("not-found", "Caller user not found.");
      }
      const callerData = callerSnap.data() as UserData;

      // Prevent self-pair
      if (callerData.pair_code === partnerCodeToPairWith) {
        throw new HttpsError("invalid-argument", "Cannot pair with your own code.");
      }
      if (callerData.partner_uid) {
        throw new HttpsError("failed-precondition", "You are already paired.");
      }

      // Find partner
      const partnerQuery = db
        .collection("users")
        .where("pair_code", "==", partnerCodeToPairWith)
        .limit(1);
      const partnerSnap = await tx.get(partnerQuery);
      if (partnerSnap.empty) {
        throw new HttpsError("not-found", "Partner code invalid.");
      }
      const partnerDoc = partnerSnap.docs[0];
      const partnerUid = partnerDoc.id;
      const partnerData = partnerDoc.data() as UserData;

      if (partnerUid === callerUid) {
        throw new HttpsError("invalid-argument", "Cannot pair with yourself.");
      }
      if (partnerData.partner_uid) {
        throw new HttpsError(
          "failed-precondition",
          `User ${partnerData.name || partnerUid} is already paired.`
        );
      }

      // Generate fresh codes
      const newCallerCode = generatePairCode();
      const newPartnerCode = generatePairCode();

      // Update both docs
      tx.update(callerRef, {
        partner_uid: partnerUid,
        pair_code: newCallerCode,
        partner_welcomed: false
      });
      tx.update(partnerDoc.ref, {
        partner_uid: callerUid,
        pair_code: newPartnerCode,
        partner_welcomed: false
      });

      return { newPairCode: newCallerCode };
    });

    return {
      success: true,
      message: "Successfully paired!",
      newPairCode: result.newPairCode,
    };
  } catch (err: any) {
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Pairing failed.");
  }
});

/**
 * Unpair the caller from their partner.
 * No data payload expected.
 */
export const unpairUsers = onCall({ region: "us-central1" }, async (req) => {
  const auth = req.auth;
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Must be called while authenticated.");
  }
  const callerUid = auth.uid;

  try {
    const result = await db.runTransaction(async (tx) => {
      const callerRef = db.collection("users").doc(callerUid);
      const callerSnap = await tx.get(callerRef);
      if (!callerSnap.exists) {
        throw new HttpsError("not-found", "Caller user not found.");
      }
      const callerData = callerSnap.data() as UserData;

      if (!callerData.partner_uid) {
        throw new HttpsError("failed-precondition", "You are not paired with anyone.");
      }
      const partnerUid = callerData.partner_uid;
      const partnerRef = db.collection("users").doc(partnerUid);
      const partnerSnap = await tx.get(partnerRef);

      // Generate new codes
      const newCallerCode = generatePairCode();
      tx.update(callerRef, {
        partner_uid: null,
        pair_code: newCallerCode,
        partner_welcomed: false
      });

      let newPartnerCode: string | undefined;
      if (partnerSnap.exists) {
        newPartnerCode = generatePairCode();
        tx.update(partnerRef, {
          partner_uid: null,
          pair_code: newPartnerCode,
          partner_welcomed: false
        });
      }

      return { newPairCode: newCallerCode };
    });

    return {
      success: true,
      message: "Successfully unpaired.",
      newPairCode: result.newPairCode,
    };
  } catch (err: any) {
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Unpairing failed.");
  }
});
