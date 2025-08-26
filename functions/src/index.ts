
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const auth = admin.auth();
const db = admin.firestore();

// This function assigns an admin role to a specific user upon their first sign-up.
export const setAdminClaimOnCreate = functions.auth.user().onCreate(async (user) => {
  const adminEmail = "dandurajkumarworld24@gmail.com";

  if (user.email === adminEmail) {
    functions.logger.info(`Assigning admin role to new user: ${user.email}`);
    try {
      // Set the custom claim 'admin' to true on the user's token
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
// It is intended for sending notifications to followers.
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
