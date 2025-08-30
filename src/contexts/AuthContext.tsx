
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onIdTokenChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/use-admin';

interface AuthContextType {
  adminUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, checkAdminStatus } = useAdmin();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setAdminUser(user);
      if (user) {
        await checkAdminStatus(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [checkAdminStatus]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // After sign-in, onIdTokenChanged will fire, triggering the admin check.
    if (!userCredential.user) {
        throw new Error("User not found after sign in.");
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      // Clear local state immediately for faster UI update
      setAdminUser(null);
      // This will also trigger onIdTokenChanged with a null user.
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({ variant: "destructive", title: "Sign Out Failed", description: "An error occurred while signing out." });
    }
  }, [toast]);

  const value = { adminUser, isAdmin, loading, signInWithEmail, signOut };

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
