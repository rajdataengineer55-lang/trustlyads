
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, deleteDoc, onSnapshot, query, getDocs } from 'firebase/firestore';
import type { User } from 'firebase/auth';

const followersCollection = collection(db, 'followers');

// Add a user as a follower
export const addFollower = async (user: User) => {
  const followerDoc = doc(followersCollection, user.uid);
  await setDoc(followerDoc, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    followedAt: new Date(),
  });
};

// Remove a user as a follower
export const removeFollower = async (userId: string) => {
  const followerDoc = doc(followersCollection, userId);
  await deleteDoc(followerDoc);
};

// Check if a user is following
export const isFollowing = async (userId: string): Promise<boolean> => {
  const followerDoc = doc(followersCollection, userId);
  const docSnap = await getDoc(followerDoc);
  return docSnap.exists();
};

// Get the total count of followers with real-time updates
export const getFollowersCount = (setCount: (count: number) => void): (() => void) => {
  const q = query(followersCollection);
  const unsubscribe = onSnapshot(q, (snapshot) => {
    setCount(snapshot.size);
  });
  return unsubscribe; // Return the unsubscribe function to be called on cleanup
};

// Get all followers (for admin panel)
export const getAllFollowers = async () => {
    const snapshot = await getDocs(followersCollection);
    const followers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return followers;
}
