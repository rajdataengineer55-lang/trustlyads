
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// This function is intended for sending notifications when a new offer is created.
// It is not related to the admin permissions fix.
export const onNewOfferSendNotification = functions.firestore
  .document("offers/{offerId}")
  .onCreate(async (snap) => {
    const newOffer = snap.data();
    functions.logger.info(`New offer created: ${newOffer.title}`, {
      structuredData: true,
    });

    // 1. Get all followers from the 'followers' collection.
    const followersSnapshot = await db.collection("followers").get();
    if (followersSnapshot.empty) {
      functions.logger.info("No followers to notify.");
      return;
    }

    const followers = followersSnapshot.docs.map((doc) => doc.data());
    functions.logger.info(`Found ${followers.length} followers to notify.`, followers.map((f) => f.email));

    // This is where you would add logic to send emails or push notifications.
    return;
  });
