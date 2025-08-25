
// =================================================================================================
// IMPORTANT: ACTION REQUIRED FOR FILE UPLOADS TO WORK
// =================================================================================================
// Client-side file uploads to Firebase Storage require a CORS configuration on your Google Cloud
// Storage bucket. This is a one-time setup.
//
// 1. You will need a file named `cors.json` in your project's root directory. The contents of that
//    file determine which websites are allowed to upload files. You can edit this file
//    at any time to add or remove domains.
//
//    See: `cors.json`
//
// 2. Find your correct bucket name. For this project, it is:
//
//    gs://localpulse-9e3lz.appspot.com
//
// 3. Run this gcloud command in your terminal or in the Google Cloud Shell to apply the rules,
//    replacing <YOUR_BUCKET_URL> with the name you found in the previous step:
//
//    gsutil cors set cors.json gs://localpulse-9e3lz.appspot.com
//
// 4. To verify the settings were applied correctly, run:
//
//    gsutil cors get gs://localpulse-9e3lz.appspot.com
//
// After you run these commands, client-side uploads will be allowed from your live domain.
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
