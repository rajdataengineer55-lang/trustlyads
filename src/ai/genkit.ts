
'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {initializeApp, getApps} from 'firebase-admin/app';

// When running in a Google Cloud environment like App Hosting,
// initializeApp() automatically discovers the project credentials.
if (!getApps().length) {
  initializeApp();
}

export const ai = genkit({
  plugins: [googleAI()],
});
