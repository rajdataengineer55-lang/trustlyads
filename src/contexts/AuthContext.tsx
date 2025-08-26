
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
import type { AdminLoginData } from '@/components/admin-login-form';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (data: AdminLoginData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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
      // This is not a real error. It happens when the user closes the popup.
      // We can safely ignore it and not show a toast message.
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

  const signInWithEmail = async ({ email, password }: AdminLoginData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // **THIS IS THE FIX**: Force a token refresh to get custom claims immediately.
      await userCredential.user.getIdToken(true); 
      
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
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signOut }}>
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
