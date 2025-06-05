import { auth, firestore, storage } from "@/config/firebase";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
/* ─────────────────────────── types ─────────────────────────── */

interface SavedStep {
  answers: Record<string, string>;   // qId ➜ option text (or value)
  finishedAt: any;                   // Firestore Timestamp
}

interface JourneyProgress {
  //currentStepId: string | null;
  startedAt: any;
  completedAt: any;
  completedSteps: Record<string, SavedStep>;
}

interface UserType {
  uid?: string;
  email?: string | null;
  name?: string | null;
  dob?: Date | null;
  gender?: string | null;
  image?: string | null;
  image_set_skipped?: boolean ;
  In_romantic_relationship: string | null;
  christian_based_tools?: boolean;

  pair_code: string, // This will be updated by the cloud function's response
  partner_uid: string | null;
  partner_welcomed: boolean;
  partner_base?: {
    partner_name: string;
    anniversary_date: Date | null;
    status: string;
    kids: string;
    live: string;
    religion_importance: string;
    religion: string;
    breakup: string
  };
  ecr_scores?: {
    anxiety: number;
    avoidance: number;
  };
}

interface AuthContextType {
  user: UserType | null;
  progress: Record<string, JourneyProgress>;
  setUser: (u: UserType | null) => void;

  /* authentication */
  login: (email: string, password: string) => Promise<{ success: boolean; msg?: any }>;
  register: (email: string, password: string) => Promise<{ success: boolean; msg?: any }>;
  deleteAccount: () => Promise<{ success: boolean; msg?: string }>;

  /* user profile helpers */
  saveUserData: (uid: string, data: Partial<UserType>) => Promise<void>;
  uploadProfilePhoto: (uid: string, photoUri: string) => Promise<string>;

  /* app routing */
  nextRoute: (uid: string, smartRouting: boolean, goStartup: boolean) => Promise<void>;

  /* partner pairing */
  pairWithPartner: (uid: string, code: string) => Promise<void>;
  unpairPartner: (uid: string) => Promise<void>;
  fetchPartnerData: (uid: string) => Promise<UserType | null>;

  /* journey progress */
  ensureJourneyProgress: (journeyId: string) => Promise<void>;
  completeStep: (
    journeyId: string,
    stepId: string,
    nextStepId: string | null
  ) => Promise<void>;
}


// Define expected response types from your Cloud Functions
interface CloudFunctionSuccessResponse {
  success: boolean;
  message: string;
  newPairCode?: string; // The user's new pair_code after the operation
}


// Utility Function to Generate Pairing Code
const generatePairCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part = () =>
    Array.from({ length: 3 })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
  return `${part()}-${part()}`;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [myJourneys, setJourneys] = useState<Record<string, JourneyProgress>>({});
  const router = useRouter();
  const functions = getFunctions(auth.app);

  /* ─────────────────── journey-progress helpers ─────────────────── */

  const journeysCol = (uid: string) => collection(firestore, "users", uid, "myJourneys");

  // Add new journey progress to users data 
  const ensureJourneyProgress = async (journeyId: string) => {
    const uid = auth.currentUser?.uid;

    if (!uid) return;

    const ref = doc(journeysCol(uid), journeyId);
    if (!(await getDoc(ref)).exists()) {
      await setDoc(ref, {
        //currentStepId: null,
        startedAt: serverTimestamp(),
        completedAt: null,
        completedSteps: {},
      });
    }
  };

  // User completes a step run this function
  const completeStep = async (
    journeyId: string,
    stepId: string,
    //nextStepId: string | null,
    answers: Record<string, string>,
    score: number | null,
  ) => {
    const uid = auth.currentUser?.uid;
    
    if (!uid) return;

    const ref = doc(journeysCol(uid), journeyId);

    await updateDoc(ref, {
      [`completedSteps.${stepId}`]: {
        answers,
        score,
        finishedAt: serverTimestamp(),
      },
      //currentStepId: nextStepId,
      //...(nextStepId === null && { completedAt: serverTimestamp() }),
    });
  };


  /* ───────────────── auth-state listener ───────────────── */

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    console.log("Current User: ", user);

    if (!firebaseUser) {
      setUser(null);
      router.replace("/(auth)/welcome");
      return;
    }
      const uid = firebaseUser.uid;
      const userData = await fetchUserData(uid);
      console.log(userData)

      if(!userData){
        setUser(null);
        router.replace("/(auth)/welcome");
        return;
      }

      setUser(userData);

      /* live listener for journey progress */
      const unsubProg = onSnapshot(journeysCol(uid), (snap) => {
        const j: Record<string, JourneyProgress> = {};
        snap.forEach((d) => (j[d.id] = d.data() as JourneyProgress));
        setJourneys(j);
      });


      nextRoute(uid, false);

      return () => unsubProg(); // clean up when auth changes
  });

  return () => unsub();
  }, []);

  const nextRoute = async (uid: string, smartrouting: boolean, goStartup:boolean) => {

    const userData = await fetchUserData(uid);
    if (userData) {

      if (router.canGoBack()) {
        router.dismissAll();
      }

      if(smartrouting){ // USER ROUTING (WITH BUTTON)

        // personal
        if (!userData?.name || !userData?.dob ) { // || !userData?.gender
          if(!goStartup) {
            router.replace("/setup/personal/about");
          }else{
            router.replace("/setup/personal/startup");
          }

          return;
        }

        if (!userData?.gender && !userData?.In_romantic_relationship) {
          if(!goStartup) {
            router.replace("/setup/personal/questions");
          }else{
            router.replace("/setup/personal/startup");
          }

          return;
        }

        if (!userData?.image && userData?.image_set_skipped != true) {
          if(!goStartup) {
            router.replace("/setup/personal/photo");
          }else{
            router.replace("/setup/personal/startup");
          }

          return;
        }

        // Relationship
        if(userData?.In_romantic_relationship == "Yes"){
          if (!userData?.partner_base?.partner_name) {
            if(!goStartup) {
              router.replace("/setup/relationship/about");
            }else{
              router.replace("/setup/relationship/startup");
            }

            return;
          }

          if (!userData?.partner_base?.anniversary_date) {
            if(!goStartup) {
              router.replace("/setup/relationship/anniversary");
            }else{
              router.replace("/setup/relationship/startup");
            }

            return;
          }

          const { status, kids, live, breakup } = userData.partner_base;
          if (!status || !kids || !live || !breakup) { // || !religion_importance || !religion
            if(!goStartup) {
              router.replace("/setup/relationship/questions");
            }else{
              router.replace("/setup/relationship/startup");
            }

            return;
          }
        }

        // attachment style
        if (!userData?.ecr_scores?.anxiety || !userData?.ecr_scores?.avoidance) {
          if(!goStartup) {
            router.replace("/setup/attachment/questions");
          }else{
            router.replace("/setup/attachment/startup");
          }

          return;
        }

        setUser(userData);
        if (router.canGoBack()) {
          router.dismissAll();
        }
        router.replace("/(tabs)/home");
        
        if(userData?.partner_welcomed == false && userData?.partner_uid){
          router.push("/screens/partnerWelcome")
        }

      }else { //// APP LOADED ROUTING

        // personal
        if (!userData?.name || !userData?.dob || !userData?.gender || !userData?.In_romantic_relationship || !userData?.image && userData?.image_set_skipped != true) { //|| !userData?.image [rage bait detected]
          router.replace("/setup/personal/startup");
          return;
        }

        // Relationship
        const { status, kids, live, religion_importance, religion, breakup } = userData.partner_base ?? {};
        if(userData?.In_romantic_relationship == "Yes"){
          if (!status || !kids || !live  || !breakup) { // || !religion_importance || !religion
            router.replace("/setup/relationship/startup");
            return;
          }
        }

        // attachment style
        if (!userData?.ecr_scores?.anxiety || !userData?.ecr_scores?.avoidance) {
          router.replace("/setup/attachment/startup");
          return;
        }

        setUser(userData);
        if (router.canGoBack()) {
          router.dismissAll();
        }
        router.replace("/(tabs)/home");

        if(userData?.partner_welcomed == false && userData?.partner_uid){
          router.push("/screens/partnerWelcome")
        }

      }
    }

  }

  const fetchUserData = async (uid: string): Promise<UserType | null> => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
      return {
          uid,
          ...docSnap.data(),
      } as UserType;}
    } catch (error) {
        console.log("Error fetching user data: ", error);
    }

    return null;
  };


  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("auth/invalid-email")) msg = "Invalid email";
      if (msg.includes("auth/user-not-found")) msg = "User not found";
      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const code = generatePairCode();
      console.log("Your pair code: ",code)
      await setDoc(doc(firestore, "users", response.user.uid), {
        uid: response.user.uid,
        email,
        pair_code: code,
        partner_uid: null,
        partner_welcomed: false
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("auth/email-already-in-use")) msg = "Email already in use";
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    const userData = await fetchUserData(uid);
    if (userData) {
      setUser(userData);
    }
  };

  const saveUserData = async (uid: string, data: Partial<UserType>) => {
    const docRef = doc(firestore, "users", uid);
    await updateDoc(docRef, data);
    updateUserData(uid);
  };

  const uploadProfilePhoto = async (uid: string, photoUri: string) => {
    const storageRef = ref(storage, `users/${uid}/profile.jpg`);
    const response = await fetch(photoUri);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    console.log("Uploaded image...")
    const downloadURL = await getDownloadURL(storageRef);
    await saveUserData(uid, { image: downloadURL });
    return downloadURL;
  };

  /// TESTING PAIRING

  // --- UPDATED PAIRING FUNCTIONS ---
  const pairWithPartner = async (uid: string, partnerCode: string) => {
    if (!partnerCode) {
      Alert.alert("Invalid code", "Please enter a valid pairing code.");
      return;
    }

    // Optional: Client-side check to prevent calling function if already paired
    if (user?.partner_uid) {
        Alert.alert("Already Paired", "You are already paired. Please unpair first or this might indicate an issue.");
        // Consider refreshing data if this state seems incorrect
        // await updateUserDataState(uid);
        return;
    }

    const pairUsersFunction = httpsCallable< {partnerCode: string }, CloudFunctionSuccessResponse>(functions, 'pairUsers');
    try {
      console.log(`Attempting to pair with code: ${partnerCode}`);
      const result = await pairUsersFunction({ partnerCode }); // Pass data as an object

      const { success, message, newPairCode } = result.data;

      if (success) {
        Alert.alert("Pairing Successful", message);
        // The Cloud Function handles updating pair_code and partner_uid in Firestore.
        // We just need to refresh the local user state.
        await updateUserData(uid); // This will fetch the latest user data, including the new pair_code.
      } else {
        // This else block might not be reached if HttpsError is thrown and caught below
        Alert.alert("Pairing Failed", message || "An unexpected error occurred during pairing.");
      }
    } catch (error: any) {
      console.error("Error calling pairUsers function:", error);
      // error.code and error.message are from HttpsError
      Alert.alert(
        "Pairing Failed",
        error.message || "An unexpected error occurred."
      );
    }
  };

  const unpairPartner = async (uid: string) => {
    // Optional: Client-side check
     if (!user?.partner_uid) {
        Alert.alert("Not Paired", "You are not currently paired with anyone.");
        // await updateUserDataState(uid); // Optionally refresh
        return;
    }

    const unpairUsersFunction = httpsCallable<Record<string, never>, CloudFunctionSuccessResponse>(functions, 'unpairUsers');
    try {
      console.log("Attempting to unpair...");
      const result = await unpairUsersFunction(); // No data payload needed

      const { success, message } = result.data;

      if (success) {
        Alert.alert("Unpairing Successful", message);
        // Cloud function handles DB updates. Refresh local state.
        await updateUserData(uid);
      } else {
        Alert.alert("Unpairing Failed", message || "An unexpected error occurred during unpairing.");
      }
    } catch (error: any) {
      console.error("Error calling unpairUsers function:", error);
      Alert.alert(
        "Unpairing Failed",
        error.message || "An unexpected error occurred."
      );
    }
  };

  // --- fetchPartnerData (largely unchanged, still useful) ---
  const fetchPartnerData = async (uid: string ): Promise<UserType | null> => {
    console.log("Getting current user's data to find partner's UID!");
    // Fetch the current user's data first to get their partner_uid
    const currentUserData = user?.uid === uid ? user : await fetchUserData(uid); // Use local state if possible

    if (!currentUserData?.partner_uid) {
      console.log("User does not have a partner_uid.");
      return null;
    }
    console.log(`Workspaceing partner data for partner UID: ${currentUserData.partner_uid}`);
    return fetchUserData(currentUserData.partner_uid); // Re-use fetchUserData for the partner
  };

  // 
  const deleteAccount = async (): Promise<{ success: boolean; msg?: string }> => {
    if (!auth.currentUser || !user?.uid) {
      return { success: false, msg: "User not authenticated." };
    }

    const deleteAccountFn = httpsCallable<undefined, { success: boolean; message: string }>(
      functions,
      "deleteAccount"
    );

    try {
      const result = await deleteAccountFn();
      setUser(null);
      router.dismissAll();
      router.replace("/(auth)/welcome");
      return { success: result.data.success, msg: result.data.message };
    } catch (err: any) {
      console.error("Account deletion failed:", err);
      return { success: false, msg: err.message || "Delete failed" };
    }
  };

  const contextValue: AuthContextType = {
    user,
    myJourneys,
    setUser,

    login,
    register,
    deleteAccount,

    saveUserData,
    uploadProfilePhoto,

    nextRoute,

    pairWithPartner,
    unpairPartner,
    fetchPartnerData,

    ensureJourneyProgress,
    completeStep,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
