
'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {initializeApp, getApps} from 'firebase-admin/app';

// Initialize Firebase Admin SDK if not already initialized.
if (!getApps().length) {
  initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const ai = genkit({
  plugins: [googleAI()],
});
