
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
  browserLocalPersistence,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
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
  sendVerificationCode: (phoneNumber: string) => Promise<void>;
  confirmVerificationCode: (code: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Store the confirmation result in a global variable.
// This is not ideal for server-side rendering, but works for this client-side context.
let confirmationResult: ConfirmationResult | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, checkAdminStatus } = useAdmin();

  useEffect(() => {
    const processAuth = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            
            const result = await getRedirectResult(auth);
            
            const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
              let finalUser = currentUser;

              // If there's a redirect result, that's our most recent user state.
              if (result?.user) {
                finalUser = result.user;
              }

              setUser(finalUser);
              if (finalUser) {
                  await checkAdminStatus(finalUser);
                  if (result?.user) {
                    toast({ title: "Signed In", description: `Welcome, ${finalUser.displayName || finalUser.email}!`});
                  }
              }
              setLoading(false);
            });

            return unsubscribe;

        } catch (error) {
            console.error("Auth provider error:", error);
            setLoading(false);
        }
    };
    
    const unsubscribePromise = processAuth();

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    }

  }, [checkAdminStatus, toast]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user) {
        throw new Error("User not found after sign in.");
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }, []);

  const sendVerificationCode = useCallback(async (phoneNumber: string) => {
    try {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    } catch (error: any) {
        console.error("Error sending verification code", error);
        // This makes sure we show a user-friendly error.
        if (error.code === 'auth/invalid-phone-number') {
            throw new Error('The phone number is not valid.');
        }
        throw new Error('Could not send verification code. Please try again later.');
    }
  }, []);

  const confirmVerificationCode = useCallback(async (code: string) => {
    if (!confirmationResult) {
        throw new Error("No verification process in progress. Please send a code first.");
    }
    await confirmationResult.confirm(code);
    // User is now signed in. The onIdTokenChanged listener will update the user state.
    confirmationResult = null; // Clear result after use
  }, []);


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

  const value = { user, isAdmin, loading, signInWithEmail, signInWithGoogle, sendVerificationCode, confirmVerificationCode, signOut };

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
