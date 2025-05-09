import { auth, firestore } from "@/config/firebase";
import { useRouter } from "expo-router";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface UserType {
  uid?: string;
  email?: string | null;
  image?: any;
}

interface AuthContextType {
  user: UserType;
  setUser: Function;
  login: (email: string, password: string) => Promise<{ success: boolean; msg?: any }>;
  register: (email: string, password: string) => Promise<{ success: boolean; msg?: any }>;
  updateUserData: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserType | null>(null); // <-- Changed this line
    const router = useRouter();

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("firebase user: ", firebaseUser)
            if(firebaseUser){
                setUser({
                    uid: firebaseUser?.uid,
                    email: firebaseUser?.email
                });
                updateUserData(firebaseUser.uid)
                // router.replace("/(tabs)/home")
                router.replace("/(auth)/test")
            }else{
                // no user
                setUser(null);
                router.replace("/(auth)/welcome")
            }
        });

        return () => unsub();
    }, [])

    const login = async (email: string, password:string) => {
        try{
            await signInWithEmailAndPassword(auth, email, password)
            return {success: true}
        } catch (error:any){
            let msg = error.message;
            console.log("error message: ", msg)
            if(msg.includes("(auth/invalid-credential)")) msg = "Wrong credentials"
            if(msg.includes("(auth/invalid-email)")) msg = "Invaild email"
            return {success: false, msg}
        }
    }
    const register = async (email: string, password:string) => {
        try{
            let response = await createUserWithEmailAndPassword(auth, email,password)
            await setDoc(doc(firestore, "users",response?.user?.uid),{
                email,
                uid:response?.user?.uid,
            })
            await signInWithEmailAndPassword(auth, email, password)
            return {success: true}
        } catch (error:any){
            let msg = error.message;
            console.log("error message: ", msg)
           if(msg.includes("(auth/email-already-in-use)")) msg = "This email is already in use"
            if(msg.includes("(auth/invalid-email)")) msg = "Invaild email"
            return {success: false, msg}
        }
    }
    const updateUserData = async (uid: string) => {
        try{
            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                const data = docSnap.data();
                const userData: UserType = {
                    uid: data?.uid,
                    email: data.email || null,
                    image: data.image || null,
                }
                setUser({...userData});
            }
        } catch (error:any){
            let msg = error.message;
            console.log("error: ",error)
        }
    }

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    }

    return(
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ():AuthContextType => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be wrapped inside AuthProvider")
    }
    return context
}