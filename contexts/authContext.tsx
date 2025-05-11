import { auth, firestore, storage } from "@/config/firebase";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";

interface UserType {
  uid?: string;
  email?: string | null;
  name?: string | null;
  dob?: Date | null;
  gender?: string | null;
  image?: string | null;
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
  user: UserType;
  setUser: Function;
  login: (email: string, password: string) => Promise<{ success: boolean; msg?: any }>;
  register: (email: string, password: string) => Promise<{ success: boolean; msg?: any }>;
  saveUserData: (uid: string, data: Partial<UserType>) => Promise<void>;
  uploadProfilePhoto: (uid: string, photoUri: string) => Promise<string>;
  nextRoute: (uid: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

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

      setUser(userData);
      nextRoute(uid, false);
  });

  return () => unsub();
  }, []);

  const nextRoute = async (uid: string, smartrouting: boolean) => {

    const userData = await fetchUserData(uid);
    if (userData) {

      if(smartrouting){

        // personal
        if (!userData?.name || !userData?.dob) {
          router.replace("/setup/personal/startup");
          return;
        }

        if (!userData?.image) {
          router.replace("/setup/personal/photo");
          return;
        }

        // Relationship
        if (!userData?.partner_base?.partner_name) {
          router.replace("/setup/relationship/about");
          return;
        }

        if (!userData?.partner_base?.anniversary_date) {
          router.replace("/setup/relationship/anniversary");
          return;
        }

        const { status, kids, live, religion_importance, religion, breakup } = userData.partner_base;
        if (!status || !kids || !live || !religion_importance || !religion || !breakup) {
          router.replace("/setup/relationship/questions");
          return;
        }

        // attachment style
        if (!userData?.ecr_scores?.anxiety || !userData?.ecr_scores?.avoidance) {
          router.replace("/setup/attachment/questions");
          return;
        }

        setUser(userData);
        router.replace("/(tabs)/home");

      }else {

        // personal
        if (!userData?.name || !userData?.dob || !userData?.image) {
          router.replace("/setup/personal/startup");
          return;
        }

        // Relationship
        const { status, kids, live, religion_importance, religion, breakup } = userData.partner_base;
        if (!status || !kids || !live || !religion_importance || !religion || !breakup) {
          router.replace("/setup/relationship/startup");
          return;
        }

        // attachment style
        if (!userData?.ecr_scores?.anxiety || !userData?.ecr_scores?.avoidance) {
          router.replace("/setup/attachment/startup");
          return;
        }

        setUser(userData);
        router.replace("/(tabs)/home");

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
      await setDoc(doc(firestore, "users", response.user.uid), {
        uid: response.user.uid,
        email,
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

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    saveUserData,
    uploadProfilePhoto,
    nextRoute,
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
