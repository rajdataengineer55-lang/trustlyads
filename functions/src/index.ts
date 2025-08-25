
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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

    // 1. Get all followers from the 'followers' collection.
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

    // --- TODO: Add notification logic here ---
    // In the next step, we can integrate an email service (like SendGrid)
    // or push notifications (FCM) to send a message to each follower.
    // For example, we could create a batch write to a new 'notifications'
    // collection that the app could then display to the user.

    return;
  });
