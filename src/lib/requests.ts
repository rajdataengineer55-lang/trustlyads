
'use client';

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  orderBy,
  doc,
  updateDoc,
  DocumentData,
  Query,
} from 'firebase/firestore';

export interface Request {
  id: string;
  userId: string;
  category: string;
  title: string;
  description: string;
  location: string;
  status: 'open' | 'responded' | 'closed';
  createdAt: Date;
  responses?: RequestResponse[];
}

export interface RequestData {
  userId: string;
  category: string;
  title: string;
  description: string;
  location: string;
  status: 'open' | 'responded' | 'closed';
}

export interface RequestResponse {
    id: string;
    businessId: string;
    businessName: string;
    message: string;
    contactNumber: string;
    createdAt: Date;
}

export interface ResponseData {
    businessId: string;
    businessName: string;
    message: string;
    contactNumber: string;
}


const requestsCollection = collection(db, 'requests');

const mapDocToRequest = (doc: DocumentData): Request => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
      responses: data.responses || [],
    } as Request;
}

const fetchRequestsWithResponses = async (q: Query<DocumentData>): Promise<Request[]> => {
    try {
        const querySnapshot = await getDocs(q);
        const requests = await Promise.all(querySnapshot.docs.map(async (requestDoc) => {
            const request = mapDocToRequest(requestDoc);
            
            const responsesCollection = collection(db, 'requests', request.id, 'responses');
            const responsesQuery = query(responsesCollection, orderBy('createdAt', 'desc'));
            const responsesSnapshot = await getDocs(responsesQuery);

            request.responses = responsesSnapshot.docs.map(responseDoc => {
                const responseData = responseDoc.data();
                return {
                    id: responseDoc.id,
                    ...responseData,
                    createdAt: responseData.createdAt ? (responseData.createdAt as Timestamp).toDate() : new Date(),
                } as RequestResponse;
            });
            return request;
        }));
        return requests;
    } catch (error) {
        console.error("Error fetching requests with responses: ", error);
        return [];
    }
};

export const addRequest = async (requestData: RequestData) => {
  const requestWithTimestamp = {
    ...requestData,
    createdAt: serverTimestamp(),
  };
  await addDoc(requestsCollection, requestWithTimestamp);
};

export const getAllRequests = async (): Promise<Request[]> => {
    const q = query(requestsCollection, orderBy('createdAt', 'desc'));
    return fetchRequestsWithResponses(q);
};

export const getRequestsByUser = async (userId: string): Promise<Request[]> => {
    const q = query(
        requestsCollection, 
        where('userId', '==', userId), 
        orderBy('createdAt', 'desc')
    );
    return fetchRequestsWithResponses(q);
};

export const addResponseToRequest = async (requestId: string, responseData: ResponseData) => {
    const responseWithTimestamp = {
        ...responseData,
        createdAt: serverTimestamp(),
    };
    const responsesCollection = collection(db, 'requests', requestId, 'responses');
    await addDoc(responsesCollection, responseWithTimestamp);
}

export const updateRequestStatus = async (requestId: string, status: 'open' | 'responded' | 'closed') => {
    const requestDoc = doc(db, 'requests', requestId);
    await updateDoc(requestDoc, { status });
};
