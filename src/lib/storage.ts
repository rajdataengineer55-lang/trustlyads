import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path in the storage bucket to upload the file to.
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const fileId = uuidv4();
  const fileToUpload = file;

  const fileRef = ref(storage, `${path}/${fileId}-${fileToUpload.name}`);
  
  // Upload the file
  const snapshot = await uploadBytes(fileRef, fileToUpload);
  
  // Get the download URL
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};

/**
 * Uploads multiple files to Firebase Storage.
 * @param files A FileList object containing the files to upload.
 * @param path The path in the storage bucket.
 * @returns A promise that resolves with an array of download URLs.
 */
export const uploadMultipleFiles = async (files: FileList, path: string): Promise<string[]> => {
  const uploadPromises = Array.from(files).map(file => uploadFile(file, path));
  const urls = await Promise.all(uploadPromises);
  return urls;
};
