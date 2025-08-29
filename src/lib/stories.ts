
'use client';

import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  orderBy,
  doc,
  updateDoc,
  increment,
  deleteDoc,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';


export interface Story {
  id: string;
  offerId: string;
  businessName: string;
  businessImage: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: Date;
  views: number;
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
    views: data.views || 0,
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
    views: 0,
  };
  await addDoc(storiesCollection, storyWithTimestamp);
};

/**
 * Fetches all stories. The 24-hour filter was removed for easier development visibility.
 * @returns A promise that resolves to an array of active stories.
 */
export const getActiveStories = async (): Promise<Story[]> => {
  // The 24-hour filter is removed to make stories always visible in development.
  // const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const q = query(
    storiesCollection, 
    // where('createdAt', '>=', twentyFourHoursAgo), // This line is commented out
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

/**
 * Increments the view count for a single story.
 * @param storyId The ID of the story to update.
 */
export const incrementStoryView = async (storyId: string) => {
  const storyDoc = doc(db, 'stories', storyId);
  try {
    await updateDoc(storyDoc, {
      views: increment(1)
    });
  } catch (error) {
    console.error(`Failed to increment view for story ${storyId}:`, error);
  }
};


/**
 * Deletes a story document from Firestore and its associated file from Storage.
 * @param storyId The ID of the story document to delete.
 * @param mediaUrl The public URL of the media file to delete from Storage.
 */
export const deleteStory = async (storyId: string, mediaUrl: string) => {
  // Delete the Firestore document
  const storyDocRef = doc(db, 'stories', storyId);
  await deleteDoc(storyDocRef);

  // Delete the file from Firebase Storage
  // We need to create a reference from the download URL to delete the file.
  try {
    const fileRef = ref(storage, mediaUrl);
    await deleteObject(fileRef);
  } catch (error: any) {
    // It's possible the file doesn't exist or rules prevent deletion.
    // We log the error but don't throw, as the primary goal (deleting the DB record) is complete.
    if (error.code === 'storage/object-not-found') {
      console.warn(`Story file not found in Storage, but DB record was deleted: ${mediaUrl}`);
    } else {
      console.error(`Failed to delete story file from Storage: ${mediaUrl}`, error);
    }
  }
};
