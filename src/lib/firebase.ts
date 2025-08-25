// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

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
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators in development environment.
// This code will only run on the client-side.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Point the SDKs to the emulators.
    // @ts-ignore - a temporary flag to ensure we only connect once.
    if (!globalThis._firebaseEmulatorsConnected) {
        console.log("Connecting to Firebase emulators");
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        connectFirestoreEmulator(db, "127.0.0.1", 8080);
        connectStorageEmulator(storage, "127.0.0.1", 9199);
        // @ts-ignore
        globalThis._firebaseEmulatorsConnected = true;
    }
}

export { db, storage, auth };
export default app;
