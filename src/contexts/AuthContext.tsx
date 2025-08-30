
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  onIdTokenChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  User,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/use-admin';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, checkAdminStatus } = useAdmin();

  useEffect(() => {
    const processAuth = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            // Check for redirect result first
            const result = await getRedirectResult(auth);
            if (result) {
                // This means the user is coming back from a successful sign-in
                setUser(result.user);
                await checkAdminStatus(result.user);
                toast({ title: "Signed In", description: `Welcome back, ${result.user.displayName}!`});
            }

            // Then set up the state change listener
            const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
                setUser(currentUser);
                if (currentUser) {
                    await checkAdminStatus(currentUser);
                }
                setLoading(false);
            });

            return unsubscribe;
        } catch (error) {
            console.error("Auth provider error:", error);
            setLoading(false);
        }
    };
    
    processAuth();
  }, [checkAdminStatus, toast]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user) {
        throw new Error("User not found after sign in.");
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithRedirect(auth, provider);
    } catch(error) {
        console.error("Google sign in failed:", error);
        toast({ variant: "destructive", title: "Sign In Failed", description: "Could not sign in with Google." });
    }
  }, [toast]);


  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({ variant: "destructive", title: "Sign Out Failed", description: "An error occurred while signing out." });
    }
  }, [toast]);

  const value = { user, isAdmin, loading, signInWithEmail, signInWithGoogle, signOut };

  return (
    <AuthContext.Provider value={value}>
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

    