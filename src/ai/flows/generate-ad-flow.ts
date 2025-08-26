
'use server';

/**
 * @fileOverview An AI flow for generating compelling ad copy for business offers.
 *
 * - generateAdCopy - A function that takes business and offer details and returns suggested ad copy.
 * - GenerateAdCopyInput - The input type for the generateAdCopy function.
 * - GenerateAdCopyOutput - The return type for the generateAdCopy function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAdCopyInputSchema = z.object({
  business: z.string().describe('The name of the business.'),
  title: z.string().describe('The title of the offer or ad.'),
  discount: z.string().describe('The discount or special deal being offered (e.g., "20% OFF", "Buy One Get One Free").'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const GenerateAdCopyOutputSchema = z.object({
  adCopy: z.string().describe('The generated, compelling ad copy, ready to be used in the offer details section. Should be a few paragraphs long.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;

// This is the exported function that the UI will call.
export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdCopyPrompt',
  input: { schema: GenerateAdCopyInputSchema },
  output: { schema: GenerateAdCopyOutputSchema },
  prompt: `You are an expert marketing copywriter for a local advertising platform. Your task is to generate compelling and professional ad copy for a local business.

The ad copy should be engaging, highlight the value of the offer, and encourage customers to visit the business.

Use the following information to craft the ad copy. Write a few paragraphs.

Business Name: {{{business}}}
Offer Title: {{{title}}}
The Deal: {{{discount}}}

Generate the ad copy and return it in the 'adCopy' field.`,
});

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
