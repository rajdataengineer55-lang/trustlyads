
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  signOut as firebaseSignOut, 
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  type User 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/use-admin';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isCheckingAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const { isAdmin, isCheckingAdmin, checkAdminStatus } = useAdmin();

  // This effect runs once on mount to handle the redirect result and set up the auth listener.
  useEffect(() => {
    // We set persistence at the very beginning.
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // First, check if we're coming back from a Google sign-in.
        return getRedirectResult(auth);
      })
      .then((result) => {
        if (result) {
          // A user has successfully signed in via redirect.
          toast({
            title: "Signed In",
            description: `Welcome, ${result.user.displayName}!`,
          });
          // The onAuthStateChanged listener below will handle setting the user state.
        }
      })
      .catch((error) => {
        console.error("Error during auth initialization or redirect:", error);
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: "Could not complete sign in after redirect. Please try again.",
        });
      })
      .finally(() => {
        // After handling any potential redirect, set up the listener for ongoing auth state changes.
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setLoading(true);
          if (currentUser) {
            setUser(currentUser);
            await checkAdminStatus(currentUser);
          } else {
            setUser(null);
            await checkAdminStatus(null);
          }
          setLoading(false);
        });
        
        // Return the unsubscribe function to be called on component unmount.
        return () => unsubscribe();
      });
  // The empty dependency array ensures this effect runs only once on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true); // Set loading state to give user feedback
    try {
      await signInWithRedirect(auth, provider);
      // The user will be redirected, and the logic in the useEffect will handle the result.
    } catch (error: any) {
      console.error("Error starting sign in with Google redirect:", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Could not start the sign-in process. Please try again.",
      });
      setLoading(false); // Reset loading on error
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle the rest
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
    } finally {
      // The onAuthStateChanged listener will set loading to false.
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
       toast({
        title: "Signed Out",
        description: "You have successfully signed out.",
      });
       // The onAuthStateChanged listener will handle the state change
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "Could not sign out. Please try again.",
      });
    }
  };

  const authLoading = loading || isCheckingAdmin;

  return (
    <AuthContext.Provider value={{ user, loading: authLoading, isAdmin, isCheckingAdmin, signInWithGoogle, signInWithEmail, signOut }}>
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
