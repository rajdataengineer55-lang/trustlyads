
import { useState, useCallback } from 'react';
import type { User } from 'firebase/auth';

/**
 * A custom hook to check for Firebase custom claims.
 * It provides the admin status and a function to trigger the check.
 */
export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  const checkAdminStatus = useCallback(async (user: User | null) => {
    setIsCheckingAdmin(true);
    if (user) {
      try {
        // Force a token refresh to get the latest claims
        const idTokenResult = await user.getIdTokenResult(true);
        console.log("Checking claims:", idTokenResult.claims);
        // Check for the admin custom claim
        setIsAdmin(!!idTokenResult.claims.admin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    } else {
      // If no user, they are not an admin
      setIsAdmin(false);
    }
    setIsCheckingAdmin(false);
  }, []);

  return { isAdmin, isCheckingAdmin, checkAdminStatus };
};
