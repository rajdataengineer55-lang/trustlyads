// =================================================================================================
// CRITICAL FIX: "Missing or insufficient permissions" Upload Error
// =================================================================================================
// This persistent error is almost certainly caused by a missing CORS configuration
// on your project's Storage Bucket. This is a one-time setup that must be
// performed from your command line.
//
// Please follow these steps carefully.
//
// ### Step 1: Install the Google Cloud CLI
//
// If you don't have it, install it from here: https://cloud.google.com/sdk/docs/install
//
// ### Step 2: Log in to the gcloud CLI
//
// Open your terminal or command prompt and run this command. Follow the browser prompts to log in
// with the same Google account that owns your Firebase project.
//
//    gcloud auth login
//
// ### Step 3: Set your active project
//
// Tell gcloud which project to work on. Your Firebase Project ID is `localpulse-9e3lz`.
// Run this command:
//
//    gcloud config set project localpulse-9e3lz
//
// ### Step 4: Apply the CORS Configuration
//
// This is the most important step. Your bucket name is `localpulse-9e3lz.appspot.com`.
// Run this command from your project's root directory (the same directory where `cors.json` is).
//
//    gsutil cors set cors.json gs://localpulse-9e3lz.appspot.com
//
// ### Step 5: Authorize the Domain for Firebase Authentication
//
// You must also authorize your domain to be used for signing users in.
//
//    1. Go to the Firebase Console Authentication settings:
//       https://console.firebase.google.com/project/localpulse-9e3lz/authentication/settings
//
//    2. Select the "Settings" tab and then "Authorized domains" from the side menu.
//
//    3. Click "Add domain" and enter: cloudworkstations.dev
//
//    4. Click "Add".
//
// After completing both the `gsutil` command and adding the authorized domain, the permission
// errors for both file uploads and user sign-in will be resolved.
// =================================================================================================

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './firebase';

/**
 * Uploads a single file to a specified destination in Firebase Storage.
 * @param file The file to upload.
 * @param destination The folder path in storage (e.g., 'offers', 'stories').
 * @returns A promise that resolves with the download URL.
 */
export const uploadFile = async (file: File, destination: 'offers' | 'stories' | string): Promise<string> => {
    if (!file) {
        throw new Error("File is required for upload.");
    }

    const fileId = uuidv4();
    const filePath = `${destination}/${fileId}-${file.name}`;
    const fileRef = ref(storage, filePath);

    try {
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        // Re-throwing the original error to be handled by the caller.
        // The error object from Firebase often contains useful codes like 'storage/unauthorized'.
        throw error;
    }
};


/**
 * Uploads multiple files to Firebase Storage using the client-side JS SDK.
 * @param files The FileList object from the file input.
 * @returns A promise that resolves with an array of download URLs.
 */
export const uploadMultipleFiles = async (files: FileList): Promise<string[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises: Promise<string>[] = Array.from(files).map(file => uploadFile(file, 'offers'));

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error during file uploads:', error);
    throw error; // Re-throw the error to be handled in the component
  }
};
