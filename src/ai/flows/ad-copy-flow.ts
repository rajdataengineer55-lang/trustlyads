
'use server';

/**
 * @fileOverview An AI flow for generating ad copy for business offers.
 *
 * - generateAdCopy - A function that takes keywords and generates a title, description, and tags.
 * - GenerateAdCopyInput - The input type for the generateAdCopy function.
 * - GenerateAdCopyOutput - The return type for the generateAdCopy function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAdCopyInputSchema = z.object({
  keywords: z.string().describe('A few keywords or a short phrase describing the offer.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const GenerateAdCopyOutputSchema = z.object({
  title: z.string().describe('A catchy, concise title for the offer (max 10 words).'),
  description: z.string().describe('A detailed, appealing description of the offer, highlighting its benefits (2-3 sentences).'),
  tags: z.array(z.string()).describe('An array of 3-5 relevant keywords (tags) for discoverability.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;


export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdCopyPrompt',
  input: { schema: GenerateAdCopyInputSchema },
  output: { schema: GenerateAdCopyOutputSchema },
  prompt: `You are an expert marketing copywriter for a local advertising platform. Your task is to generate compelling ad copy based on a few keywords.

The output must be in a JSON object format.

The user has provided the following keywords: {{{keywords}}}

Based on these keywords, generate:
1.  A short, catchy "title" for the offer.
2.  A professional and appealing "description" for the offer.
3.  An array of 3 to 5 relevant "tags" to help users find this offer.`,
});

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate ad copy.');
    }
    return output;
  }
);
