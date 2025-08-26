// =================================================================================================
// HOW TO FIX THE "The specified bucket does not exist" ERROR
// =================================================================================================
// The error `NotFoundException: 404 The specified bucket does not exist` means that Firebase
// Storage has not been enabled for your project yet. You must enable it in the Firebase Console
// before you can upload files.
//
// ===> Step 1: Enable Firebase Storage <===
//
//    1. Open the Firebase Console for your project: https://console.firebase.google.com/project/localpulse-9e3lz/storage
//    2. In the "Storage" section, click the "Get started" button.
//    3. Follow the on-screen prompts to create your default storage bucket. It's safe to use
//       the default settings.
//
// ===> Step 2: Apply the CORS Configuration (After Enabling Storage) <===
//
// After your bucket is created, run the following command in your Cloud Shell to allow your
// website to upload files to it. This command will now succeed.
//
//     gsutil cors set cors.json gs://localpulse-9e3lz.appspot.com
//
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
