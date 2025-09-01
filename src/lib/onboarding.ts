
'use client';

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export type PaymentStatus = 'Paid' | 'Due';

export interface OnboardedUserData {
  name: string;
  businessName: string;
  phoneNumber: string;
  paymentAmount?: number;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface OnboardedUser extends OnboardedUserData {
  id: string;
  onboardedDate: Date;
  paymentDueDate: Date;
}

const onboardedUsersCollection = collection(db, 'onboardedUsers');

// Helper to convert Firestore timestamp to Date for client-side use
const mapDocToUser = (docSnapshot: any): OnboardedUser => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    onboardedDate: (data.onboardedDate as Timestamp).toDate(),
    paymentDueDate: (data.paymentDueDate as Timestamp).toDate(),
    paymentStatus: data.paymentStatus || 'Due', // Default to 'Due' if not set
  } as OnboardedUser;
};

/**
 * Adds a new onboarded user to Firestore.
 * Sets the onboarded date and calculates the initial payment due date.
 * @param userData The data for the new user.
 */
export const addOnboardedUser = async (userData: OnboardedUserData) => {
  const onboardedDate = new Date();
  const paymentDueDate = new Date(onboardedDate);
  paymentDueDate.setDate(onboardedDate.getDate() + 30);

  const userWithTimestamp = {
    ...userData,
    onboardedDate: Timestamp.fromDate(onboardedDate),
    paymentDueDate: Timestamp.fromDate(paymentDueDate),
    paymentStatus: 'Due', // New users always start as 'Due'
  };
  await addDoc(onboardedUsersCollection, userWithTimestamp);
};

/**
 * Fetches all onboarded users from Firestore, ordered by their onboarding date.
 * @returns A promise that resolves to an array of onboarded users.
 */
export const getOnboardedUsers = async (): Promise<OnboardedUser[]> => {
  try {
    const q = query(onboardedUsersCollection, orderBy('onboardedDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToUser);
  } catch (error) {
    console.error('Error fetching onboarded users: ', error);
    return [];
  }
};

/**
 * Renews a user's 30-day payment cycle and resets their payment status to 'Due'.
 * Updates the onboardedDate to now and recalculates the paymentDueDate.
 * @param userId The ID of the user to renew.
 */
export const renewOnboardedUser = async (userId: string) => {
  const userDoc = doc(db, 'onboardedUsers', userId);
  const newOnboardedDate = new Date();
  const newPaymentDueDate = new Date(newOnboardedDate);
  newPaymentDueDate.setDate(newOnboardedDate.getDate() + 30);

  await updateDoc(userDoc, {
    onboardedDate: Timestamp.fromDate(newOnboardedDate),
    paymentDueDate: Timestamp.fromDate(newPaymentDueDate),
    paymentStatus: 'Due', // Reset status on renewal
  });
};

/**
 * Updates the payment status of a user.
 * @param userId The ID of the user to update.
 * @param status The new payment status ('Paid' or 'Due').
 */
export const updatePaymentStatus = async (userId: string, status: PaymentStatus) => {
    const userDoc = doc(db, 'onboardedUsers', userId);
    await updateDoc(userDoc, {
        paymentStatus: status,
    });
};


/**
 * Deletes an onboarded user record from Firestore.
 * @param userId The ID of the user to delete.
 */
export const deleteOnboardedUser = async (userId: string) => {
  const userDoc = doc(db, 'onboardedUsers', userId);
  await deleteDoc(userDoc);
};
