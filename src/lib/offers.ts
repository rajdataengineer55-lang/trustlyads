

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
    Query,
    DocumentData,
} from 'firebase/firestore';
import type { Offer } from '@/contexts/OffersContext';

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
  price?: number;
  tags: string[];
  isHidden?: boolean;
  views?: number;
  clicks?: number;
  postedBy?: string;
  allowCall?: boolean;
  phoneNumber?: string;
  allowChat?: boolean;
  chatLink?: string;
  allowSchedule?: boolean;
  scheduleLink?: string;
}

const offersCollection = collection(db, 'offers');

// Helper to convert Firestore timestamp to Date
const mapDocToOffer = (doc: any): Offer => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
    views: data.views || 0,
    clicks: data.clicks || 0,
    storyViews: data.storyViews || 0,
  } as Offer;
};

// Generic fetch function
const fetchOffersWithoutReviews = async (q: Query<DocumentData>): Promise<Offer[]> => {
  try {
    const querySnapshot = await getDocs(q);
    const offers = querySnapshot.docs.map(mapDocToOffer);
    return offers;
  } catch (error) {
    console.error("Error fetching offers: ", error);
    return [];
  }
};


// Fetches ONLY public offers. Safe for server-side and non-admin clients.
export const getPublicOffers = async (): Promise<Offer[]> => {
    const publicOffersQuery = query(
      offersCollection,
      where("isHidden", "==", false),
      orderBy("createdAt", "desc")
    );
    return fetchOffersWithoutReviews(publicOffersQuery);
};

// Fetches ALL offers. Should ONLY be called for authenticated admins.
export const getAllOffers = async (): Promise<Offer[]> => {
    const allOffersQuery = query(offersCollection, orderBy("createdAt", "desc"));
    return fetchOffersWithoutReviews(allOffersQuery);
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
