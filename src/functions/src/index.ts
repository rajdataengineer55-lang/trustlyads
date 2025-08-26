
'use server';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * Sets a custom claim on a new user account if their email matches a predefined admin email.
 * This is a secure way to bootstrap the first admin user.
 */
export const setInitialAdminClaim = functions.auth.user().onCreate(async (user) => {
  const adminEmails = ["dandurajkumarworld24@gmail.com"]; // Add more initial admins if needed

  if (adminEmails.includes(user.email ?? '')) {
    try {
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      functions.logger.info(`Custom claim 'admin' set for initial admin: ${user.uid}`);
      // Also create a user document for them in Firestore
      await db.collection("users").doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        role: 'admin',
        uid: user.uid,
      }, { merge: true });
    } catch (error) {
      functions.logger.error("Error setting initial admin claim:", error);
    }
  } else {
     // For regular users, create a document in the 'users' collection with the 'user' role.
     await db.collection("users").doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        role: 'user',
        uid: user.uid,
      }, { merge: true });
  }
});


/**
 * Firestore trigger that listens for changes on documents in the 'users' collection.
 * If a user's 'role' field is changed, this function updates their custom claims.
 */
export const onUserRoleChange = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const userId = context.params.userId;

    // Check if the role has actually changed
    if (newData.role !== oldData.role) {
      functions.logger.info(`Role changed for user ${userId} from '${oldData.role}' to '${newData.role}'`);
      try {
        if (newData.role === 'admin') {
          // Set the admin custom claim
          await admin.auth().setCustomUserClaims(userId, { admin: true });
          functions.logger.info(`Successfully set 'admin' claim for user ${userId}`);
        } else {
          // If the role is anything else, remove the admin claim
          await admin.auth().setCustomUserClaims(userId, { admin: false });
          functions.logger.info(`Successfully removed 'admin' claim for user ${userId}`);
        }
      } catch (error) {
        functions.logger.error(`Error updating custom claims for user ${userId}:`, error);
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

