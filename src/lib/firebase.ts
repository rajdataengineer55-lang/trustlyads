// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your production Firebase project configuration.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators in development environment.
if (process.env.NODE_ENV === 'development') {
    // Check if running in the browser
    if (typeof window !== 'undefined') {
        // @ts-ignore
        if (!globalThis._firebaseEmulatorsConnected) {
            console.log("Connecting to Firebase emulators");
            connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
            connectFirestoreEmulator(db, "127.0.0.1", 8080);
            connectStorageEmulator(storage, "127.0.0.1", 9199);
            // @ts-ignore
            globalThis._firebaseEmulatorsConnected = true;
        }
    }
}

export { db, storage, auth };
export default app;
