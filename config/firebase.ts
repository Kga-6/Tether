import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhpREsX8wyGvvW1lIe0EI4APZs3WBIjuo",
  authDomain: "tether-1f278.firebaseapp.com",
  projectId: "tether-1f278",
  storageBucket: "tether-1f278.firebasestorage.app",
  messagingSenderId: "141284218385",
  appId: "1:141284218385:web:24218c35403d0fc96cc3b0",
  measurementId: "G-3TQ9MTN8P6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth with Expo AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore instance
export const firestore = getFirestore(app);