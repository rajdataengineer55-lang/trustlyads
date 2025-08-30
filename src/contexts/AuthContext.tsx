
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
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [loading, setLoading] = useState(true); // This now represents the initial auth check
  const { toast } = useToast();
  
  const { isAdmin, isCheckingAdmin, checkAdminStatus } = useAdmin();

  // This effect runs once on mount to handle the redirect result and set up the auth listener.
  useEffect(() => {
    // We set persistence at the very beginning.
    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        const result = await getRedirectResult(auth);
        if (result) {
          toast({
            title: "Signed In",
            description: `Welcome, ${result.user.displayName}!`,
          });
        }
      } catch (error) {
        console.error("Error during auth initialization or redirect:", error);
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: "Could not complete sign in after redirect. Please try again.",
        });
      }

      // After handling any potential redirect, set up the listener for ongoing auth state changes.
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          await checkAdminStatus(currentUser);
        } else {
          setUser(null);
          // Set admin to false immediately for a logged-out user.
          await checkAdminStatus(null); 
        }
        // This setLoading(false) is crucial. It marks the end of the initial check.
        setLoading(false);
      });
        
      return unsubscribe;
    };
    
    initializeAuth();
    
  // The empty dependency array ensures this effect runs only once on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
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
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
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

  // Combine loading states: initial auth check OR ongoing admin check.
  const isAppLoading = loading || isCheckingAdmin;
  
  const value = { user, loading: isAppLoading, isAdmin, isCheckingAdmin, signInWithGoogle, signInWithEmail, signOut };
  
  // Render a full-page skeleton ONLY during the initial, one-time authentication check.
  // This prevents any child components (and other contexts) from rendering before auth is ready.
  if (loading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 md:px-6 py-10">
                    <div className="space-y-8">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

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
