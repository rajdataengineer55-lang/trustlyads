// IMPORTANT: To make this client-side upload work, you MUST configure CORS on your Google Cloud Storage bucket.
// Run the following commands in your local terminal (with gcloud/gsutil installed) or in the Cloud Shell.
//
// 1. Create a file named `cors.json` with the following content:
// [
//   {
//     "origin": ["http://localhost:9002", "https://*.firebaseapp.com", "https://*.web.app", "https://*.cloudworkstations.dev"],
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
// 2. Run this command to apply the CORS configuration to your bucket:
//    gsutil cors set cors.json gs://localpulse-9e3lz.appspot.com
//
// 3. To verify the settings, run:
//    gsutil cors get gs://localpulse-9e3lz.appspot.com
//
// You only need to do this once. After that, client-side uploads will be allowed.

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
