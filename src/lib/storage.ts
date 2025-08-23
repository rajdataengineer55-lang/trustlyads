import { storage, auth } from './firebase';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Firebase Storage using the Firebase SDK.
 * @param file The file to upload.
 * @param path The path in the storage bucket to upload the file to.
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to upload files.");
  }
  
  const fileId = uuidv4();
  const fileRef = ref(storage, `${path}/${fileId}-${file.name}`);

  try {
    // Use the official SDK function to upload the file.
    // This handles all authentication and request signing automatically.
    const snapshot = await uploadBytes(fileRef, file);

    // Get the download URL from the reference.
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;

  } catch (error: any) {
    console.error("Firebase SDK Upload Error:", error);
    let description = "Could not upload the file. Please check your network connection and try again.";
    
    // Provide more specific error messages based on the error code.
    switch (error.code) {
      case 'storage/unauthorized':
        description = "Permission denied. Please check your Firebase Storage security rules to ensure you have write access.";
        break;
      case 'storage/canceled':
        description = "Upload was canceled.";
        break;
      case 'storage/unknown':
        description = "An unknown error occurred during the upload.";
        break;
    }

    // You can also throw a new error with the descriptive message.
    throw new Error(description);
  }
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
