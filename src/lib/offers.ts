
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
    onSnapshot,
    serverTimestamp,
    Timestamp,
    collectionGroup,
    writeBatch
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
  hint: string;
  discount: string;
  tags: string[];
  allowCall: boolean;
  allowChat: boolean;
  allowSchedule: boolean;
  phoneNumber?: string;
  chatLink?: string;
  scheduleLink?: string;
  isHidden?: boolean;
}


const offersCollection = collection(db, 'offers');

// Helper to convert Firestore timestamp to Date
const mapDocToOffer = (doc: any): Offer => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    reviews: data.reviews || [] // Reviews are now a subcollection, this can be removed or adapted
  } as Offer;
};

// Get all offers with real-time updates and subcollection of reviews
export const getOffers = (callback: (offers: Offer[]) => void) => {
  const q = query(offersCollection, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const offersWithReviews: Offer[] = [];
    
    for (const doc of querySnapshot.docs) {
      const offer = mapDocToOffer(doc);
      
      const reviewsCollection = collection(db, 'offers', doc.id, 'reviews');
      const reviewsQuery = query(reviewsCollection, orderBy('createdAt', 'desc'));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      
      offer.reviews = reviewsSnapshot.docs.map(reviewDoc => ({
        id: reviewDoc.id,
        ...reviewDoc.data(),
        createdAt: (reviewDoc.data().createdAt as Timestamp)?.toDate() || new Date()
      })) as Review[];

      offersWithReviews.push(offer);
    }
    callback(offersWithReviews);
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
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
    createdAt: serverTimestamp()
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
