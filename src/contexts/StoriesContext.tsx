
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getStories, 
  addStory as addStoryToDb, 
  deleteStory as deleteStoryFromDb,
  type StoryData,
} from '@/lib/stories';

export interface Story {
  id: string;
  imageUrl: string;
  businessName: string;
  location: string;
  offerId: string; // Changed from link to offerId
  createdAt: Date;
}

interface StoriesContextType {
  stories: Story[];
  loading: boolean;
  addStory: (story: StoryData) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

export function StoriesProvider({ children }: { children: ReactNode }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getStories((storiesFromDb) => {
      setStories(storiesFromDb);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addStory = async (story: StoryData) => {
    await addStoryToDb(story);
  };

  const deleteStory = async (id: string) => {
    await deleteStoryFromDb(id);
  };

  return (
    <StoriesContext.Provider value={{ stories, loading, addStory, deleteStory }}>
      {children}
    </StoriesContext.Provider>
  );
}

export function useStories() {
  const context = useContext(StoriesContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
}
