
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
    getPublicOffers,
    getAllOffers,
    addOffer as addOfferToDb, 
    updateOffer as updateOfferInDb, 
    deleteOffer as deleteOfferFromDb,
    addReview as addReviewToDb,
    toggleOfferVisibility as toggleVisibilityInDb,
    incrementOfferView as incrementViewInDb,
    incrementOfferClick as incrementClickInDb,
    type OfferData,
} from '@/lib/offers';
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
}

interface OffersContextType {
  offers: Offer[];
  loading: boolean;
  fetchOffers: () => Promise<void>; // Expose fetchOffers
  addOffer: (offer: OfferData) => Promise<void>;
  updateOffer: (id: string, updatedOfferData: Partial<OfferData>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  boostOffer: (id: string) => void; 
  getOfferById: (id: string) => Offer | undefined;
  addReview: (offerId: string, review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  toggleOfferVisibility: (id: string) => Promise<void>;
  incrementOfferView: (id: string) => Promise<void>;
  incrementOfferClick: (id: string) => Promise<void>;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAuth();

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
        if (isAdmin) {
            // If the user is an admin, fetch all offers to get hidden ones too.
            const allOffers = await getAllOffers();
            setOffers(allOffers);
        } else {
            // For regular users, just set the public offers.
            const publicOffers = await getPublicOffers();
            setOffers(publicOffers);
        }
    } catch (error) {
        console.error("Failed to fetch offers:", error);
        // In case of error, fall back to an empty list.
        setOffers([]);
    } finally {
        setLoading(false);
    }
  }, [isAdmin]);

  // This effect ensures that we only fetch offers once the authentication status is known.
  useEffect(() => {
    // We wait for the auth state to be resolved before fetching.
    if (!authLoading) {
      fetchOffers();
    }
  }, [authLoading, fetchOffers]);

  const addOffer = async (offer: OfferData) => {
    await addOfferToDb(offer);
    await fetchOffers(); // Refetch after adding
  };

  const updateOffer = async (id: string, updatedOfferData: Partial<OfferData>) => {
    await updateOfferInDb(id, updatedOfferData);
    await fetchOffers(); // Refetch after updating
  };
  
  const deleteOffer = async (id: string) => {
    await deleteOfferFromDb(id);
    await fetchOffers(); // Refetch after deleting
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
  
  const addReview = async (offerId: string, review: Omit<Review, 'id' | 'createdAt'>) => {
    await addReviewToDb(offerId, review);
    await fetchOffers(); // Refetch to show new review
  };

  const toggleOfferVisibility = async (id: string) => {
    const offer = getOfferById(id);
    if(offer) {
        await toggleVisibilityInDb(id, !offer.isHidden);
        await fetchOffers(); // Refetch to update status
    }
  };

  const incrementOfferView = async (id: string) => {
    await incrementViewInDb(id);
    // Optimistically update UI to avoid full refetch
    setOffers(prev => prev.map(o => o.id === id ? {...o, views: (o.views || 0) + 1} : o));
  };

  const incrementOfferClick = async (id: string) => {
    await incrementClickInDb(id);
    // Optimistically update UI to avoid full refetch
    setOffers(prev => prev.map(o => o.id === id ? {...o, clicks: (o.clicks || 0) + 1} : o));
  };

  return (
    <OffersContext.Provider value={{ offers, loading, fetchOffers, addOffer, getOfferById, updateOffer, deleteOffer, boostOffer, addReview, toggleOfferVisibility, incrementOfferView, incrementOfferClick }}>
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
