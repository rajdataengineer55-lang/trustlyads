
'use server';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// This function triggers whenever a user document is created in Firestore.
// It assigns a default 'user' role.
export const onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const { userId } = context.params;
    functions.logger.info(`New user created: ${userId}, setting default role.`);

    const userDocRef = db.collection('users').doc(userId);

    // Set the default role to 'user'
    return userDocRef.set({ role: 'user' }, { merge: true });
  });

// This function triggers whenever a user's role is changed in their document.
// It updates their custom authentication claim to match their new role.
export const onUserRoleChange = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const { userId } = context.params;
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (newValue.role === previousValue.role) {
      functions.logger.info(`Role for user ${userId} has not changed.`);
      return null;
    }

    functions.logger.info(`Role for user ${userId} changed from ${previousValue.role} to ${newValue.role}.`);

    try {
      if (newValue.role === 'admin') {
        await admin.auth().setCustomUserClaims(userId, { admin: true });
        functions.logger.info(`Successfully set admin claim for ${userId}.`);
      } else {
        // If the role is anything other than admin, remove the claim.
        await admin.auth().setCustomUserClaims(userId, { admin: false });
        functions.logger.info(`Successfully removed admin claim for ${userId}.`);
      }
    } catch (error) {
      functions.logger.error(`Error setting custom claim for user ${userId}:`, error);
    }
    return null;
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
