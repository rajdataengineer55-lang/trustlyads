import {genkit, GenkitMemory, GenkitTracer} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {genkitNext} from '@genkit-ai/next';

interface MyPluginOptions {
  getMemory: () => GenkitMemory;
  getTracer: () => GenkitTracer;
}

export const ai = genkit(
  genkitNext({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.0-flash',
  })
);
