

import { db } from './firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
    increment,
    where,
} from 'firebase/firestore';
import type { Offer, Review } from '@/contexts/OffersContext';

// This is the data structure for creating/updating offers.
// It excludes fields that are auto-generated or managed separately (like id, reviews, createdAt).
export interface OfferData {
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
  isHidden?: boolean;
  views?: number;
  clicks?: number;
}

const offersCollection = collection(db, 'offers');

// Helper to convert Firestore timestamp to Date
const mapDocToOffer = (doc: any): Offer => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
    reviews: data.reviews || [], // Initialize with empty array
    views: data.views || 0,
    clicks: data.clicks || 0,
    storyViews: data.storyViews || 0,
  } as Offer;
};

// Get all offers with subcollection of reviews
export const getOffers = async (): Promise<Offer[]> => {
  // This function runs on the server, where `auth.currentUser` is not available.
  // We fetch only visible offers, and rely on security rules to control admin access to hidden ones.
  // The query now explicitly looks for `isHidden: false` which is compatible with `orderBy`.
  const offersQuery = query(
    offersCollection, 
    where('isHidden', '==', false), 
    orderBy('createdAt', 'desc')
  );

  try {
    const offersSnapshot = await getDocs(offersQuery);

    const offers = await Promise.all(offersSnapshot.docs.map(async (offerDoc) => {
        const offer = mapDocToOffer(offerDoc);
        
        const reviewsCollection = collection(db, 'offers', offer.id, 'reviews');
        const reviewsQuery = query(reviewsCollection, orderBy('createdAt', 'desc'));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        
        const reviews = reviewsSnapshot.docs.map(reviewDoc => {
            const reviewData = reviewDoc.data();
            return {
              id: reviewDoc.id,
              ...reviewData,
              createdAt: reviewData.createdAt ? (reviewData.createdAt as Timestamp).toDate() : new Date()
            } as Review;
        });
        offer.reviews = reviews;
        
        return offer;
    }));
    return offers;
  } catch (error) {
    console.error("Error fetching offers: ", error);
    // Return empty array on error to prevent site crash
    return [];
  }
};


// Helper function to clean data before sending to Firestore
const cleanDataForFirestore = (data: any) => {
    const cleanedData: { [key: string]: any } = {};
    Object.keys(data).forEach(key => {
        const value = (data as any)[key];
        if (value !== undefined) {
            cleanedData[key] = value;
        } else {
            cleanedData[key] = null; // Convert undefined to null for Firestore
        }
    });
    return cleanedData;
};


// Add a new offer
export const addOffer = async (offerData: OfferData) => {
  const cleanedOfferData = cleanDataForFirestore(offerData);
  const offerWithTimestamp = {
    ...cleanedOfferData,
    createdAt: serverTimestamp(),
    views: 0,
    clicks: 0,
  };
  await addDoc(offersCollection, offerWithTimestamp);
};

// Update an existing offer
export const updateOffer = async (id: string, offerData: Partial<OfferData>) => {
  const cleanedOfferData = cleanDataForFirestore(offerData);
  const offerDoc = doc(db, 'offers', id);
  await updateDoc(offerDoc, cleanedOfferData);
};

// Delete an offer
export const deleteOffer = async (id: string) => {
  const offerDoc = doc(db, 'offers', id);
  await deleteDoc(offerDoc);
};

// Add a review to an offer's subcollection
export const addReview = async (offerId: string, reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const reviewWithTimestamp = {
        ...reviewData,
        createdAt: serverTimestamp()
    };
    const reviewsCollection = collection(db, 'offers', offerId, 'reviews');
    await addDoc(reviewsCollection, reviewWithTimestamp);
};

// Toggle offer visibility
export const toggleOfferVisibility = async (id: string, isHidden: boolean) => {
    const offerDoc = doc(db, 'offers', id);
    await updateDoc(offerDoc, { isHidden });
};

// Increment the view count for an offer
export const incrementOfferView = async (id: string) => {
    const offerDoc = doc(db, 'offers', id);
    await updateDoc(offerDoc, {
        views: increment(1)
    });
};

// Increment the click count for an offer
export const incrementOfferClick = async (id: string) => {
    const offerDoc = doc(db, 'offers', id);
    await updateDoc(offerDoc, {
        clicks: increment(1)
    });
};
