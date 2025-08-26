
// =================================================================================================
// IMPORTANT: ACTION REQUIRED FOR FILE UPLOADS TO WORK
// =================================================================================================
// Client-side file uploads to Firebase Storage require a CORS configuration on your Google Cloud
// Storage bucket. This is a one-time setup.
//
// ### Step 1: Create your Storage Bucket
//
// The `gsutil` command failed because the bucket doesn't exist yet.
//
//    - Go to the Firebase Console: https://console.firebase.google.com/
//    - Select your project (`localpulse-9e3lz`).
//    - In the left-hand menu, go to **Build > Storage**.
//    - Click the **"Get started"** button and follow the on-screen prompts to enable Storage.
//      (You can use the default security rules for now). This will create your bucket.
//
// ### Step 2: Apply CORS Configuration
//
// Once the bucket is created, you can apply the CORS rules.
//
//    - **Your bucket name is:** `gs://localpulse-9e3lz.appspot.com`
//    - **Your config file is:** `cors.json` (already in your project)
//
//    - **Run this command** in your terminal or Cloud Shell to apply the rules:
//
//      gsutil cors set cors.json gs://localpulse-9e3lz.appspot.com
//
//    - To verify the settings were applied correctly, run:
//
//      gsutil cors get gs://localpulse-9e3lz.appspot.com
//
// After you complete these two steps, client-side uploads will be allowed.
// =================================================================================================

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './firebase';

/**
 * Uploads multiple files to Firebase Storage using the client-side JS SDK.
 * @param files The FileList object from the file input.
 * @returns A promise that resolves with an array of download URLs.
 */
export const uploadMultipleFiles = async (files: FileList): Promise<string[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises: Promise<string>[] = [];

  for (const file of Array.from(files)) {
    const fileId = uuidv4();
    const destination = `offers/${fileId}-${file.name}`;
    const fileRef = ref(storage, destination);

    const promise = uploadBytes(fileRef, file)
      .then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      })
      .catch((error) => {
        console.error(`Upload failed for ${file.name}:`, error);
        // Throw a more specific error to be caught by the caller
        throw new Error(`Failed to upload ${file.name}. Please try again.`);
      });

    uploadPromises.push(promise);
  }

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error during file uploads:', error);
    throw error; // Re-throw the error to be handled in the component
  }
};
