
'use client';

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  orderBy,
} from 'firebase/firestore';

export interface Story {
  id: string;
  offerId: string;
  businessName: string;
  businessImage: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: Date;
}

export interface StoryData {
  offerId: string;
  businessName: string;
  businessImage: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
}

const storiesCollection = collection(db, 'stories');

// Helper to convert Firestore timestamp to Date
const mapDocToStory = (doc: any): Story => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
  } as Story;
};

/**
 * Adds a new story to Firestore. Stories will expire after 24 hours via Firestore's TTL policy.
 * @param storyData The data for the new story.
 */
export const addStory = async (storyData: StoryData) => {
  const storyWithTimestamp = {
    ...storyData,
    createdAt: serverTimestamp(),
  };
  await addDoc(storiesCollection, storyWithTimestamp);
};

/**
 * Fetches all stories that are not older than 24 hours.
 * @returns A promise that resolves to an array of active stories.
 */
export const getActiveStories = async (): Promise<Story[]> => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const q = query(
    storiesCollection, 
    where('createdAt', '>=', twentyFourHoursAgo),
    orderBy('createdAt', 'desc')
  );

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToStory);
  } catch (error) {
    console.error("Error fetching active stories: ", error);
    return [];
  }
};
