
'use client';

import { db, auth } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  getCountFromServer,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';

const followersCollection = collection(db, 'followers');

/**
 * Adds the current user to the followers list.
 * @param userId The UID of the user to follow.
 */
export const addFollower = async (userId: string) => {
  if (!userId) throw new Error('User must be logged in to follow.');
  const userEmail = auth.currentUser?.email; // Get email for storage
  const followerDocRef = doc(db, 'followers', userId);
  await setDoc(followerDocRef, {
    followedAt: new Date(),
    email: userEmail || 'unknown',
  });
};

/**
 * Removes the current user from the followers list.
 * @param userId The UID of the user to unfollow.
 */
export const removeFollower = async (userId: string) => {
  if (!userId) throw new Error('User must be logged in to unfollow.');
  const followerDocRef = doc(db, 'followers', userId);
  await deleteDoc(followerDocRef);
};

/**
 * Checks if a user is following.
 * @param userId The UID of the user to check.
 * @returns A promise that resolves to true if following, false otherwise.
 */
export const isFollowing = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  const followerDocRef = doc(db, 'followers', userId);
  const docSnap = await getDoc(followerDocRef);
  return docSnap.exists();
};

/**
 * Subscribes to real-time updates of the followers count.
 * @param callback A function to call with the new count.
 * @returns An unsubscribe function.
 */
export const getFollowersCount = (callback: (count: number) => void) => {
  const q = query(followersCollection);
  // onSnapshot is more efficient for real-time counts than getCountFromServer
  const unsubscribe = onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  });
  return unsubscribe;
};
