

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
    reviews: data.reviews || [] // Initialize with empty array
  } as Offer;
};

// Get all offers with real-time updates and subcollection of reviews
export const getOffers = (callback: (offers: Offer[]) => void) => {
  const q = query(offersCollection, orderBy('createdAt', 'desc'));

  // Listen to changes in the main 'offers' collection
  const unsubscribeOffers = onSnapshot(q, (offersSnapshot) => {
    const offersById: Record<string, Offer> = {};
    
    offersSnapshot.docs.forEach(doc => {
      const offer = mapDocToOffer(doc);
      offersById[offer.id] = offer;
    });

    // Now, set up a listener for all reviews
    const reviewsQuery = query(collectionGroup(db, 'reviews'), orderBy('createdAt', 'desc'));
    
    // This will be our combined data object that we update
    let offersWithReviews = { ...offersById };

    const unsubscribeReviews = onSnapshot(reviewsQuery, (reviewsSnapshot) => {
        // Reset reviews for all offers to avoid duplication on updates
        Object.keys(offersWithReviews).forEach(offerId => {
            offersWithReviews[offerId].reviews = [];
        });

        reviewsSnapshot.forEach(reviewDoc => {
            const review = {
                id: reviewDoc.id,
                ...reviewDoc.data(),
                createdAt: (reviewDoc.data().createdAt as Timestamp)?.toDate() || new Date()
            } as Review;

            const offerRef = reviewDoc.ref.parent.parent;
            if (offerRef && offersWithReviews[offerRef.id]) {
                offersWithReviews[offerRef.id].reviews?.push(review);
            }
        });
        
        // Convert the map back to an array, maintaining the original sort order from the offers query
        const sortedOffers = offersSnapshot.docs.map(doc => offersWithReviews[doc.id]).filter(Boolean);
        callback(sortedOffers);
    });

    // Return a function that unsubscribes from both listeners
    return () => {
      unsubscribeOffers();
      unsubscribeReviews();
    };
  });

  return unsubscribeOffers;
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
