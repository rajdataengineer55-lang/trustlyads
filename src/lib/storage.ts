// =================================================================================================
// IMPORTANT: ACTION REQUIRED FOR FILE UPLOADS TO WORK
// =================================================================================================
// Client-side file uploads to Firebase Storage require a CORS configuration on your Google Cloud
// Storage bucket. This is a one-time setup.
//
// 1. Create a file named `cors.json` with the following content. This configuration allows uploads
//    from your live domain, your firebase-provided domain, and your local development environment.
//
// [
//   {
//     "origin": [
//       "https://trustlyads.in",
//       "https://localpulse-9e3lz.web.app",
//       "http://localhost:9002"
//     ],
//     "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     "responseHeader": [
//       "Content-Type",
//       "Authorization",
//       "X-Goog-Resumable",
//       "X-Goog-Meta-Goog-Firebasestorage-Original-Name"
//      ],
//     "maxAgeSeconds": 3600
//   }
// ]
//
// 2. Run this gcloud command in your terminal or in the Google Cloud Shell to apply the rules:
//
//    gsutil cors set cors.json gs://localpulse-9e3lz.appspot.com
//
// 3. To verify the settings were applied correctly, run:
//
//    gsutil cors get gs://localpulse-9e3lz.appspot.com
//
// After you run these commands, client-side uploads will be allowed from your live domain.
// =================================================================================================

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import app from './firebase';

const storage = getStorage(app);

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
