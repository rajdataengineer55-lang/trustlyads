
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
    getAllOffers,
    getPublicOffers,
    addOffer as addOfferToDb, 
    updateOffer as updateOfferInDb, 
    deleteOffer as deleteOfferFromDb,
    addReview as addReviewToDb,
    toggleOfferVisibility as toggleVisibilityInDb,
    incrementOfferView as incrementViewInDb,
    incrementOfferClick as incrementClickInDb,
    getReviewsForOffer,
    type OfferData,
} from '@/lib/offers';
import { getActiveStories } from '@/lib/stories';
import { useAuth } from './AuthContext';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Offer {
  id:string;
  title: string;
  description: string;
  business: string;
  category: string;
  location: string;
  nearbyLocation?: string;
  locationLink?: string;
  image: string;
  otherImages?: string[];
  discount: string;
  price?: number;
  tags: string[];
  allowCall: boolean;
  allowChat: boolean;
  allowSchedule: boolean;
  phoneNumber?: string;
  chatLink?: string;
  scheduleLink?: string;
  reviews?: Review[];
  isHidden?: boolean;
  createdAt: Date;
  views?: number;
  clicks?: number;
  storyViews?: number;
  postedBy?: string; // New field for business ID
}

interface OffersContextType {
  offers: Offer[];
  loading: boolean;
  fetchOffers: (forceAdmin?: boolean) => Promise<void>; // Expose fetchOffers
  addOffer: (offer: OfferData) => Promise<void>;
  updateOffer: (id: string, updatedOfferData: Partial<OfferData>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  boostOffer: (id: string) => void; 
  getOfferById: (id: string) => Offer | undefined;
  loadReviewsForOffer: (offerId: string) => Promise<Review[]>;
  addReview: (offerId: string, review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  toggleOfferVisibility: (id: string) => Promise<void>;
  incrementOfferView: (id: string) => Promise<void>;
  incrementOfferClick: (id: string) => Promise<void>;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();


  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
        const fetchFunction = isAdmin ? getAllOffers : getPublicOffers;
        const [fetchedOffers, activeStories] = await Promise.all([
           fetchFunction(),
           getActiveStories()
        ]);
        
        const storyViewsMap = new Map<string, number>();
        activeStories.forEach(story => {
          storyViewsMap.set(story.offerId, (storyViewsMap.get(story.offerId) || 0) + story.views);
        });

        const offersWithStoryViews = fetchedOffers.map(offer => ({
          ...offer,
          storyViews: storyViewsMap.get(offer.id) || 0,
        }));
        
        setOffers(offersWithStoryViews);
    } catch (error) {
        console.error("Failed to fetch offers:", error);
        setOffers([]);
    } finally {
        setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);


  const addOffer = async (offer: OfferData) => {
    await addOfferToDb(offer);
    await fetchOffers(); 
  };

  const updateOffer = async (id: string, updatedOfferData: Partial<OfferData>) => {
    await updateOfferInDb(id, updatedOfferData);
    await fetchOffers();
  };
  
  const deleteOffer = async (id: string) => {
    await deleteOfferFromDb(id);
    await fetchOffers();
  };
  
  const boostOffer = (id: string) => {
    setOffers(prevOffers => {
      const offerToBoost = prevOffers.find(offer => offer.id === id);
      if (!offerToBoost) return prevOffers;
      const otherOffers = prevOffers.filter(offer => offer.id !== id);
      return [offerToBoost, ...otherOffers];
    });
  };

  const getOfferById = useCallback((id: string) => {
    return offers.find(offer => offer.id === id);
  }, [offers]);
  
  const loadReviewsForOffer = useCallback(async (offerId: string) => {
    const reviews = await getReviewsForOffer(offerId);
    setOffers(prev => prev.map(o => o.id === offerId ? {...o, reviews} : o));
    return reviews;
  }, []);

  const addReview = async (offerId: string, review: Omit<Review, 'id' | 'createdAt'>) => {
    await addReviewToDb(offerId, review);
    // After adding a new review, we should reload them for the specific offer.
    await loadReviewsForOffer(offerId);
  };

  const toggleOfferVisibility = async (id: string) => {
    const offer = getOfferById(id);
    if(offer) {
        await toggleVisibilityInDb(id, !offer.isHidden);
        await fetchOffers(); 
    }
  };

  const incrementOfferView = async (id: string) => {
    await incrementViewInDb(id);
    setOffers(prev => prev.map(o => o.id === id ? {...o, views: (o.views || 0) + 1} : o));
  };

  const incrementOfferClick = async (id: string) => {
    await incrementClickInDb(id);
    setOffers(prev => prev.map(o => o.id === id ? {...o, clicks: (o.clicks || 0) + 1} : o));
  };

  return (
    <OffersContext.Provider value={{ offers, loading, fetchOffers, addOffer, getOfferById, updateOffer, deleteOffer, boostOffer, loadReviewsForOffer, addReview, toggleOfferVisibility, incrementOfferView, incrementOfferClick }}>
      {children}
    </OffersContext.Provider>
  );
}

export function useOffers() {
  const context = useContext(OffersContext);
  if (context === undefined) {
    throw new Error('useOffers must be used within an OffersProvider');
  }
  return context;
}
