
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// This Cloud Function sets a custom claim on a new user account if their
// email matches the specified admin email. This is how we grant admin
// privileges to the application.
export const setAdminClaimOnCreate = functions.auth.user().onCreate(async (user) => {
    if (user.email === "dandurajkumarworld24@gmail.com") {
        try {
            await admin.auth().setCustomUserClaims(user.uid, { admin: true });
            functions.logger.info(`Custom claim 'admin' set for user: ${user.uid}`);
            // Optional: You could also update a Firestore document to reflect this.
            // await db.collection("users").doc(user.uid).set({ admin: true }, { merge: true });
        } catch (error) {
            functions.logger.error("Error setting custom claim:", error);
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


// This function triggers whenever a document in the 'followers' collection is created or deleted.
// It keeps the total count updated in a separate document for efficient reading.
export const onFollowerChange = functions.firestore
  .document("followers/{followerId}")
  .onWrite(async () => {
    const followersQuery = db.collection("followers");
    const snapshot = await followersQuery.get();
    const count = snapshot.size;
    
    const metaDocRef = db.collection("meta").doc("stats");
    functions.logger.info(`Updating follower count to ${count}.`);
    
    // Set the count in the 'meta/stats' document.
    return metaDocRef.set({ followerCount: count }, { merge: true });
  });
