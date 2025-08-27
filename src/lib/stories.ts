

import { db } from './firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import type { Story } from '@/contexts/StoriesContext';

export interface StoryData {
  imageUrl: string;
  businessName: string;
  location: string;
  storyText: string;
  offerId: string;
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

// Get all stories, sorted by most recent
export const getStories = async (): Promise<Story[]> => {
  const q = query(storiesCollection, orderBy('createdAt', 'desc'));
  try {
    const snapshot = await getDocs(q);
    const stories = snapshot.docs.map(mapDocToStory);
    return stories;
  } catch (error) {
    console.error("Error fetching stories: ", error);
    return [];
  }
};

// Add a new story
export const addStory = async (storyData: StoryData) => {
  const storyWithTimestamp = {
    ...storyData,
    createdAt: serverTimestamp(),
  };
  await addDoc(storiesCollection, storyWithTimestamp);
};

// Delete a story
export const deleteStory = async (id: string) => {
  const storyDoc = doc(db, 'stories', id);
  await deleteDoc(storyDoc);
};
