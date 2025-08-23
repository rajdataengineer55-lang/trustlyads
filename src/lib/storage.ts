import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

/**
 * Compresses and uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path in the storage bucket to upload the file to.
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const fileId = uuidv4();
  
  // Image compression options
  const options = {
    maxSizeMB: 1, // Max file size in MB
    maxWidthOrHeight: 1920, // Max width or height
    useWebWorker: true,
  };
  
  let fileToUpload = file;

  // Compress the image only if it's an image file
  if (file.type.startsWith('image/')) {
      try {
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed ${file.name} from ${file.size / 1024} KB to ${compressedFile.size / 1024} KB`);
        fileToUpload = compressedFile;
      } catch (error) {
        console.error("Image compression failed, uploading original file.", error);
        // If compression fails, upload the original file
        fileToUpload = file;
      }
  }


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
