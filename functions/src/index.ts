
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

const authorizedAdminEmail = "dandurajkumarworld24@gmail.com";

// This Cloud Function sets a custom 'admin' claim on a user's account
// if their email matches the authorized admin email.
export const setAdminClaim = functions.auth.user().onCreate(async (user) => {
  if (user.email === authorizedAdminEmail) {
    try {
      await auth.setCustomUserClaims(user.uid, { admin: true });
      functions.logger.info(`Custom claim 'admin' set for user: ${user.email}`);

      // Optional: You could also add a record to Firestore to confirm.
      await db.collection("admins").doc(user.uid).set({
        email: user.email,
        adminSince: admin.firestore.FieldValue.serverTimestamp(),
      });

    } catch (error) {
      functions.logger.error(`Error setting custom claim for ${user.email}:`, error);
    }
  }
});


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
