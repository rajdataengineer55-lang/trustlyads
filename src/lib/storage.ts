

// =================================================================================================
// IMPORTANT: ACTION REQUIRED FOR FILE UPLOADS TO WORK
// =================================================================================================
// Client-side file uploads to Firebase Storage require a CORS configuration on your Google Cloud
// Storage bucket. This is a one-time setup. The persistent "Missing or insufficient permissions"
// error you are seeing is the direct result of this configuration not being applied yet.
//
// ### Step 1: Create your Storage Bucket (MANDATORY FIRST STEP)
//
// The `gsutil` command will fail if the bucket doesn't exist yet. You must create it first.
//
//    1. Go to the Firebase Console Storage section for your project by clicking this link:
//       https://console.firebase.google.com/project/localpulse-9e3lz/storage
//
//    2. If you see a "Get started" button, click it. Follow the on-screen prompts to enable
//       Storage. This will create your bucket. If you don't see "Get started", your bucket
//       already exists and you can proceed to the next step.
//
// ### Step 2: Apply CORS Configuration
//
// Once the bucket has been created in the Firebase Console, you can apply the CORS rules.
//
//    - **Your bucket name is:** `trustlyads.in.appspot.com`
//    - **Your config file is:** `cors.json` (already in your project)
//
//    - **Run this exact command** in your terminal or Google Cloud Shell to apply the rules.
//      This is the crucial step to fix the permission errors.
//
//      gsutil cors set cors.json gs://trustlyads.in.appspot.com
//
//    - To verify the settings were applied correctly, run:
//
//      gsutil cors get gs://trustlyads.in.appspot.com
//
// After you complete these two steps successfully, client-side uploads will be allowed and the
// permission error will be resolved.
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
export const uploadFile = async (file: File, destination: 'offers' | 'stories'): Promise<string> => {
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
        throw new Error(`Failed to upload ${file.name}. Please try again.`);
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
