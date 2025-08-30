
'use client';

import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  getCountFromServer,
} from 'firebase/firestore';

const followersCollection = collection(db, 'followers');

/**
 * Adds a user to the followers list.
 * @param userId The UID of the user to follow.
 */
export const addFollower = async (userId: string) => {
  if (!userId) throw new Error('User ID is required to follow.');
  const followerDocRef = doc(db, 'followers', userId);
  await setDoc(followerDocRef, {
    followedAt: new Date(),
  });
};

/**
 * Removes a user from the followers list.
 * @param userId The UID of the user to unfollow.
 */
export const removeFollower = async (userId: string) => {
  if (!userId) throw new Error('User ID is required to unfollow.');
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
 * Gets the total count of followers from the server.
 * This is more efficient than fetching all documents.
 * @returns A promise that resolves to the number of followers.
 */
export const getFollowersCount = async (): Promise<number> => {
  try {
    const q = query(followersCollection);
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting followers count: ", error);
    return 0;
  }
};
