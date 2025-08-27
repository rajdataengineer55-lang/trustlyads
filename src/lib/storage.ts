
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
        // The error object from Firebase often contains useful codes like 'storage/unauthorized', 
        // which can indicate problems with Storage Security Rules.
        throw error;
    }
};


/**
 * Uploads multiple files to Firebase Storage using the client-side JS SDK.
 * @param files The FileList object from the file input.
 * @returns A promise that resolves with an array of download URLs.
 */
export const uploadMultipleFiles = async (files: FileList | File[]): Promise<string[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const filesArray = Array.from(files);

  // This function is currently only used for offers, so it hardcodes the 'offers' destination.
  // If it needs to be used for other types like 'stories', this should be refactored to accept a destination parameter.
  const uploadPromises: Promise<string>[] = filesArray.map(file => uploadFile(file, 'offers'));
  
  try {
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error("Multiple file upload failed:", error);
    throw error;
  }
};
