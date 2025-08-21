'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating ad copy variations based on offer details.
 *
 * - generateAdCopy - A function that generates ad copy variations for a given offer.
 * - GenerateAdCopyInput - The input type for the generateAdCopy function.
 * - GenerateAdCopyOutput - The return type for the generateAdCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdCopyInputSchema = z.object({
  offerDetails: z
    .string()
    .describe('Detailed description of the offer, including product/service, discount, and validity.'),
  businessName: z.string().describe('The name of the business offering the deal.'),
  targetAudience: z.string().optional().describe('Ideal customer demographic for the offer.'),
  tone: z
    .enum(['Casual', 'Professional', 'Humorous', 'Persuasive'])
    .default('Casual')
    .describe('The tone of voice for the ad copy.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const GenerateAdCopyOutputSchema = z.object({
  adCopyVariations: z
    .array(z.string())
    .describe('An array of compelling ad copy variations.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;

export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdCopyPrompt',
  input: {schema: GenerateAdCopyInputSchema},
  output: {schema: GenerateAdCopyOutputSchema},
  prompt: `You are an expert advertising copywriter specializing in local business promotions. Based on the offer details provided, generate 3 compelling ad copy variations.

Offer Details: {{{offerDetails}}}
Business Name: {{{businessName}}}
Target Audience: {{{targetAudience}}}
Tone: {{{tone}}}

Ad Copy Variations:
1.`, // The LLM will continue from here, generating the ad copy variations.
});

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Split the output into variations, handling potential numbered lists or separators.
    const adCopyVariations = output!.adCopyVariations[0]
      .split(/\n\d+\.\s*/)
      .map(variation => variation.trim())
      .filter(variation => variation !== '');

    return {adCopyVariations};
  }
);
