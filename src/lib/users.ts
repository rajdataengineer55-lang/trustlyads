import { db } from './firebase';
import { collection, onSnapshot, doc, updateDoc, type DocumentData } from 'firebase/firestore';

export interface AppUser extends DocumentData {
    id: string;
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    role?: 'admin' | 'user';
}

/**
 * Gets a real-time stream of all users.
 * @param callback Function to call with the array of users whenever it changes.
 * @returns Unsubscribe function.
 */
export const getUsersStream = (callback: (users: AppUser[]) => void) => {
    const usersCollection = collection(db, 'users');
    
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as AppUser));
        callback(users);
    }, (error) => {
        console.error("Error fetching users:", error);
        callback([]);
    });

    return unsubscribe;
}

/**
 * Updates a user's role in their Firestore document.
 * This will trigger the onUserRoleChange Cloud Function to update their custom claim.
 * @param uid The user's ID.
 * @param role The new role to assign.
 */
export const updateUserRole = async (uid: string, role: 'admin' | 'user') => {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { role });
}
