import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { getFileHash } from './crypto';

/**
 * Uploads a single file to a specified destination in Firebase Storage.
 * It uses a content hash of the file as the filename to prevent duplicates.
 * @param file The file to upload.
 * @param destination The folder path in storage (e.g., 'offers', 'stories').
 * @returns A promise that resolves with the download URL.
 */
export const uploadFile = async (
  file: File,
  destination: 'offers' | 'stories' | string
): Promise<string> => {
  if (!file) {
    throw new Error("File is required for upload.");
  }

  // Generate a unique ID based on file content to prevent duplicates
  const fileHash = await getFileHash(file);
  const fileExtension = file.name.split('.').pop() || '';
  const uniqueFileName = `${fileHash}.${fileExtension}`;
  
  const filePath = `${destination}/${uniqueFileName}`;
  const fileRef = ref(storage, filePath);

  try {
    // Note: uploadBytes will overwrite if a file with the same name exists.
    // This is the desired behavior for our content-hashing approach.
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
 * Uploads multiple files to Firebase Storage in the given destination.
 * @param files The FileList or array of File objects.
 * @param destination The folder path in storage (e.g., 'offers', 'stories').
 * @returns A promise that resolves with an array of download URLs.
 */
export const uploadMultipleFiles = async (
  files: FileList | File[],
  destination: 'offers' | 'stories' | string
): Promise<string[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const filesArray = Array.from(files);
  const uploadPromises: Promise<string>[] = filesArray.map(file =>
    uploadFile(file, destination)
  );
  
  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Multiple file upload failed:", error);
    throw error;
  }
};
