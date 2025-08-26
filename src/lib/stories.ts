
import { db } from './firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import type { Story } from '@/contexts/StoriesContext';

export interface StoryData {
  imageUrl: string;
  businessName: string;
  location: string;
  offerId: string; // Changed from link to offerId
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

// Get all stories with real-time updates, sorted by most recent
export const getStories = (callback: (stories: Story[]) => void) => {
  const q = query(storiesCollection, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const stories = snapshot.docs.map(mapDocToStory);
    callback(stories);
  }, (error) => {
    console.error("Error fetching stories: ", error);
    callback([]);
  });

  return unsubscribe;
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
