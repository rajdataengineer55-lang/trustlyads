import { storage, auth } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path in the storage bucket to upload the file to.
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to upload files.");
  }
  
  const token = await auth.currentUser.getIdToken();
  const fileId = uuidv4();
  const fileToUpload = file;

  // Use the Firebase SDK to get a reference, which correctly handles the bucket details.
  const fileRef = ref(storage, `${path}/${fileId}-${fileToUpload.name}`);
  const bucket = fileRef.bucket;

  // *** IMPORTANT ***
  // The request is now sent directly to the Google Cloud Storage API.
  // For this to work, you MUST configure CORS on your storage bucket.
  // 1. Go to your Google Cloud Console -> Cloud Storage -> Buckets.
  // 2. Select your bucket: "localpulse-9e3lz.appspot.com"
  // 3. Go to the "Permissions" tab, then click "Edit" in the CORS section.
  // 4. Add a new entry with these values:
  //    - Origins: * (or your specific domain for production)
  //    - Methods: GET, POST, PUT, DELETE, OPTIONS
  //    - Headers: Content-Type, Authorization, X-Goog-Resumable
  // 5. Save the configuration.
  const uploadUrl = `https://www.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(fileRef.fullPath)}`;
  
  // Upload the file using fetch, including the auth token
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': fileToUpload.type,
      'Authorization': `Bearer ${token}`,
    },
    body: fileToUpload,
  });

  if (!uploadResponse.ok) {
    // Log more detail to help debug if it fails again
    const errorBody = await uploadResponse.text();
    console.error("File upload failed with status:", uploadResponse.status, "and body:", errorBody);
    let description = "Could not upload images. Please check your network and try again.";
    try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson?.error?.message?.includes('permission') || errorJson?.error?.message?.includes('CORS')) {
             description = "Upload failed. Please check your Firebase Storage CORS configuration in the Google Cloud Console."
        }
    } catch (e) {
        // Not a json error, stick with default message
    }
    throw new Error(description);
  }
  
  // Get the download URL using the SDK, which still works as expected.
  const downloadURL = await getDownloadURL(fileRef);
  
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
