
"use client";

import { useState, useCallback } from 'react';
import { type User } from 'firebase/auth';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Checks the user's ID token for an 'admin' custom claim.
   * This is the source of truth for admin status.
   * @param user The Firebase user object.
   */
  const checkAdminStatus = useCallback(async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      // Force refresh the token to get the latest custom claims.
      const idTokenResult = await user.getIdTokenResult(true);
      // The `admin` property is set via a Cloud Function.
      const isAdminClaim = !!idTokenResult.claims.admin;
      setIsAdmin(isAdminClaim);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  }, []);

  return { isAdmin, checkAdminStatus };
}
