
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your production Firebase project configuration.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgJBVTnX0rl4GVTMIccw9IY6U9hzZKRvA",
  authDomain: "localpulse-9e3lz.firebaseapp.com",
  projectId: "localpulse-9e3lz",
  storageBucket: "localpulse-9e3lz.firebasestorage.app",
  messagingSenderId: "542848805293",
  appId: "1:542848805293:web:99ae91ab88f7723b1f5924",
  measurementId: "G-5Y6R706M5Y"
};


// Initialize Firebase
// The Firebase SDK will automatically connect to the emulators if they are running.
// Configuration for this is now in firebase.json
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, auth };
export default app;
