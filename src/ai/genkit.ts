'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {genkitNext} from '@genkit-ai/next';
import {initializeApp, getApps} from 'firebase-admin/app';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized.
if (!getApps().length) {
  initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const ai = genkit(
  genkitNext({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.0-flash',
  })
);
