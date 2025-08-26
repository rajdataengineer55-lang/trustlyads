
// =================================================================================================
// ============================= HOW TO FIX THE FILE UPLOAD PERMISSION ERROR =============================
// =================================================================================================
// The "FirebaseError: Missing or insufficient permissions" error is happening because your
// Firebase Storage bucket is not configured to allow file uploads from your website.
//
// This is a TWO-STEP process. You must do BOTH steps.
//
// ===> STEP 1: ENABLE FIREBASE STORAGE IN THE CONSOLE <===
//
// The error `NotFoundException: 404 The specified bucket does not exist` proves that
// Firebase Storage has not been enabled for your project yet. You must enable it.
//
//    1. Open the Firebase Console for your project:
//       https://console.firebase.google.com/project/localpulse-9e3lz/storage
//
//    2. In the "Storage" section, click the big "Get started" button.
//
//    3. A wizard will pop up. It will ask about Security Rules and Bucket Location.
//       - For Security Rules, choose "Start in production mode". Click "Next".
//       - For the Location, choose a region (the default is usually fine). Click "Done".
//
//    4. Wait for the bucket to be created. You will see an empty file browser when it's done.
//       Your bucket is now created and exists at `gs://localpulse-9e3lz.appspot.com`.
//
//
// ===> STEP 2: APPLY THE UPLOAD PERMISSION (CORS) USING YOUR TERMINAL <===
//
// Now that the bucket exists, you must run the following command in the same Cloud Shell
// terminal you used before. This command tells your new bucket to accept uploads from your website.
//
// Copy and paste this exact command into your terminal and press Enter:
//
//     gsutil cors set cors.json gs://localpulse-9e3lz.appspot.com
//
//
// After you have completed BOTH of these steps, the "Missing or insufficient permissions"
// error will be resolved.
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
