
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
  inMemoryPersistence,
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

  useEffect(() => {
    const handleAuth = async () => {
      // First, ensure persistence is set. This is crucial for the redirect flow to work.
      await setPersistence(auth, browserLocalPersistence);

      // Then, check for the result of a redirect operation.
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User just signed in via redirect.
          toast({
            title: "Signed In",
            description: `Welcome, ${result.user.displayName}!`,
          });
        }
      } catch (error) {
        console.error("Error during getRedirectResult:", error);
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: "An unknown error occurred during sign-in. Please try again.",
        });
      }

      // Finally, set up the listener for ongoing auth state changes.
      // This will also catch the user from getRedirectResult.
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          await checkAdminStatus(currentUser);
        } else {
          setUser(null);
          await checkAdminStatus(null);
        }
        setLoading(false); // Auth process is complete
      });

      return unsubscribe;
    };

    const unsubscribePromise = handleAuth();

    return () => {
      unsubscribePromise.then(unsub => unsub && unsub());
    };
  }, [checkAdminStatus, toast]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error("Error starting sign in with Google redirect:", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Could not start the sign-in process. Please check your connection and try again.",
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle the rest
    } catch (error: any)       {
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

  const isAppLoading = loading || isCheckingAdmin;
  
  if (isAppLoading) {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50 w-full border-b h-14 bg-background"></div>
            <main className="flex-1 bg-background/50">
                <div className="container mx-auto px-4 md:px-6 py-10">
                    <div className="space-y-8">
                         <div className="animate-pulse rounded-md bg-muted h-40 w-full"></div>
                         <div className="animate-pulse rounded-md bg-muted h-24 w-full"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="animate-pulse rounded-md bg-muted h-64 w-full"></div>
                            <div className="animate-pulse rounded-md bg-muted h-64 w-full"></div>
                            <div className="animate-pulse rounded-md bg-muted h-64 w-full"></div>
                            <div className="animate-pulse rounded-md bg-muted h-64 w-full"></div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="border-t h-48 bg-background"></div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading: isAppLoading, isAdmin, isCheckingAdmin, signInWithGoogle, signInWithEmail, signOut }}>
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
