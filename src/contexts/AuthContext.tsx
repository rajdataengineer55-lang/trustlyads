
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  signInWithEmailAndPassword,
  type User 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        // When auth state changes, get a fresh ID token and check for admin claim.
        const idTokenResult = await user.getIdTokenResult(true);
        setIsAdmin(!!idTokenResult.claims.admin);
        setUser(user);

        // Create or update the user document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }, { merge: true });
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Signed In",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return;
      }
      
      console.error("Error signing in with Google:", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Could not sign in with Google. Please try again.",
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Admin Signed In",
        description: "Welcome back, admin!",
      });
      
    } catch (error: any) {
       console.error("Error signing in with email:", error);
       let description = "An unknown error occurred. Please try again.";
       if(error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          description = "Invalid email or password. Please try again.";
       }
       toast({
        variant: "destructive",
        title: "Sign In Failed",
        description,
      });
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
       toast({
        title: "Signed Out",
        description: "You have successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "Could not sign out. Please try again.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
