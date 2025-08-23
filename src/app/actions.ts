
'use server';

import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';
import { getApps, initializeApp } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized
if (!getApps().length) {
  initializeApp({
    // By explicitly providing the project ID and storage bucket, we ensure
    // the Admin SDK can authenticate and access the correct storage resource.
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

/**
 * Uploads multiple files to Firebase Storage using the Admin SDK on the server.
 * @param formData The FormData object containing the files to upload.
 * @returns A promise that resolves with an array of download URLs.
 */
export const uploadFiles = async (formData: FormData): Promise<string[]> => {
  const files = formData.getAll('files') as File[];
  
  if (!files || files.length === 0) {
    return [];
  }

  // Get the default bucket associated with the initialized app.
  const bucket = getStorage().bucket();
  const uploadPromises: Promise<string>[] = [];

  for (const file of files) {
    const fileId = uuidv4();
    const destination = `offers/${fileId}-${file.name}`;
    const fileRef = bucket.file(destination);
    
    // Convert file to buffer to be uploaded
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const promise = new Promise<string>((resolve, reject) => {
      const stream = fileRef.createWriteStream({
        metadata: {
          contentType: file.type,
        },
      });

      stream.on('error', (err) => {
        console.error('Stream Error:', err);
        reject(new Error('File upload failed.'));
      });

      stream.on('finish', async () => {
        try {
          // Make the file public to get a downloadable URL
          await fileRef.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
          resolve(publicUrl);
        } catch (err) {
            console.error('Error making file public:', err);
            reject(new Error('Failed to get download URL.'));
        }
      });

      stream.end(fileBuffer);
    });

    uploadPromises.push(promise);
  }

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error during file uploads:", error);
    throw new Error("One or more file uploads failed.");
  }
};
