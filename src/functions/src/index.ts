
'use server';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// This function triggers when a new offer is created in Firestore.
export const onNewOfferSendNotification = functions.firestore
  .document("offers/{offerId}")
  .onCreate(async (snap) => {
    const newOffer = snap.data();

    functions.logger.info(`New offer created: ${newOffer.title}`, {
      structuredData: true,
    });

    const followersSnapshot = await db.collection("followers").get();
    if (followersSnapshot.empty) {
      functions.logger.info("No followers to notify.");
      return;
    }

    const followers = followersSnapshot.docs.map((doc) => doc.data());

    functions.logger.info(
      `Found ${followers.length} followers to notify.`,
      followers.map((f) => f.email)
    );

    return;
  });


// This function triggers whenever a document in the 'followers' collection is created or deleted.
export const onFollowerChange = functions.firestore
  .document("followers/{followerId}")
  .onWrite(async () => {
    const followersQuery = db.collection("followers");
    const snapshot = await followersQuery.get();
    const count = snapshot.size;
    
    const metaDocRef = db.collection("meta").doc("stats");
    functions.logger.info(`Updating follower count to ${count}.`);
    
    return metaDocRef.set({ followerCount: count }, { merge: true });
  });
