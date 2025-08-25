
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
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

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// If we are in a development environment, connect to the local emulators
// This check ensures that this code only runs in the browser, and only once.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // This is a common trick to prevent HMR from re-connecting to the emulators on every file save.
    // @ts-ignore
    if (!globalThis._firebaseEmulatorsConnected) {
        console.log("Development environment detected. Connecting to Firebase emulators.");
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        connectStorageEmulator(storage, '127.0.0.1', 9199);
        // @ts-ignore
        globalThis._firebaseEmulatorsConnected = true;
    }
}


export { db, storage, auth };
export default app;
