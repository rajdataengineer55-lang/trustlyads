
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your production Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyCgJBVTnX0rl4GVTMIccw9IY6U9hzZKRvA",
  authDomain: "localpulse-9e3lz.firebaseapp.com",
  projectId: "localpulse-9e3lz",
  storageBucket: "localpulse-9e3lz.appspot.com",
  messagingSenderId: "542848805293",
  appId: "1:542848805293:web:99ae91ab88f7723b1f5924",
  measurementId: "G-5Y6R706M5Y"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

// Explicitly set the correct storage bucket.
const storage = getStorage(app, "gs://localpulse-9e3lz.firebasestorage.app");

export const auth = getAuth(app);
export { db, storage };
export default app;
