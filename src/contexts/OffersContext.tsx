
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  getOffers, 
  addOffer as addOfferToDb, 
  updateOffer as updateOfferInDb, 
  deleteOffer as deleteOfferFromDb,
  addReview as addReviewToDb,
  toggleOfferVisibility as toggleVisibilityInDb,
  incrementOfferView as incrementViewInDb,
  incrementOfferClick as incrementClickInDb,
  type OfferData,
} from '@/lib/offers';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  business: string;
  category: string;
  location: string;
  nearbyLocation?: string;
  locationLink?: string;
  image: string;
  otherImages?: string[];
  hint: string;
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
}

interface OffersContextType {
  offers: Offer[];
  loading: boolean;
  addOffer: (offer: OfferData) => Promise<void>;
  updateOffer: (id: string, updatedOfferData: Partial<OfferData>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  boostOffer: (id: string) => void; // This will remain client-side for now
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

  useEffect(() => {
    // Initial sort by createdAt is handled by the getOffers query in firebase.ts
    const unsubscribe = getOffers((offersFromDb) => {
      setOffers(offersFromDb);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addOffer = async (offer: OfferData) => {
    await addOfferToDb(offer);
    // Real-time listener will update state, no need for manual update
  };

  const updateOffer = async (id: string, updatedOfferData: Partial<OfferData>) => {
    await updateOfferInDb(id, updatedOfferData);
  };
  
  const deleteOffer = async (id: string) => {
    await deleteOfferFromDb(id);
  };
  
  const boostOffer = (id: string) => {
    // Note: This implementation of boost is temporary and client-side.
    // For a persistent boost, we would need to add a 'boostedAt' field to the offer in Firestore and sort by it.
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
  };

  const toggleOfferVisibility = async (id: string) => {
    const offer = getOfferById(id);
    if(offer) {
        await toggleVisibilityInDb(id, !offer.isHidden);
    }
  };

  const incrementOfferView = async (id: string) => {
    await incrementViewInDb(id);
  };

  const incrementOfferClick = async (id: string) => {
    await incrementClickInDb(id);
  };

  return (
    <OffersContext.Provider value={{ offers, loading, addOffer, getOfferById, updateOffer, deleteOffer, boostOffer, addReview, toggleOfferVisibility, incrementOfferView, incrementOfferClick }}>
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
