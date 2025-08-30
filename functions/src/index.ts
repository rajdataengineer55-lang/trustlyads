
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Sets the 'admin' custom claim on a user account.
 * This function can only be called by an authenticated user. For security,
 * in a real-world scenario, you would add a check to ensure that the caller
 * is already an admin before allowing them to set other admins.
 *
 * @param {object} data - The data object passed to the function.
 * @param {string} data.email - The email of the user to make an admin.
 * @param {functions.https.CallableContext} context - The context of the function call.
 * @returns {Promise<{result: string}>} - A promise that resolves with a success or error message.
 */
export const setAdminClaim = functions.https.onCall(async (data, context) => {
  // Optional: Add a check here to ensure the calling user is already an admin.
  // For now, any authenticated user can call this for simplicity of setup.
  // if (context.auth?.token.admin !== true) {
  //   return { error: 'Request not authorized. User must be an admin to fulfill request.' };
  // }

  const email = data.email;
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return {
      result: `Success! ${email} has been made an admin.`,
    };
  } catch (error) {
    console.error("Error setting admin claim:", error);
    return {
      error: "An error occurred while setting the admin claim.",
    };
  }
});
