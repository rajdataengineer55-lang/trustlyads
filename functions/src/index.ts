
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const auth = admin.auth();
const db = admin.firestore();

// --- Cloud Function to set admin claim on user creation ---
// When a new user signs up, check if their email matches the admin email.
// If it does, give them the `admin: true` custom claim.
export const setAdminClaimOnCreate = functions.auth.user().onCreate(async (user) => {
  const adminEmail = "dandurajkumarworld24@gmail.com";

  if (user.email === adminEmail) {
    functions.logger.info(`Assigning admin role to new user: ${user.email}`);
    try {
      await auth.setCustomUserClaims(user.uid, { admin: true });
      functions.logger.info(`Successfully assigned admin role to ${user.email}`);

      // Also create a document in the 'users' collection to reflect this role
      await db.collection("users").doc(user.uid).set({
        email: user.email,
        role: "admin",
      }, { merge: true });

    } catch (error) {
      functions.logger.error(`Error setting custom claim for ${user.email}:`, error);
    }
  } else {
    // For regular users, create a document in the 'users' collection with the 'user' role.
     await db.collection("users").doc(user.uid).set({
        email: user.email,
        role: "user",
      }, { merge: true });
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
    functions.logger.info(`Found ${followers.length} followers to notify.`, followers.map((f) => f.email));

    // --- TODO: Add notification logic here ---
    // In the next step, we can integrate an email service (like SendGrid)
    // or push notifications (FCM) to send a message to each follower.
    // For example, we could create a batch write to a new 'notifications'
    // collection that the app could then display to the user.

    return;
  });

