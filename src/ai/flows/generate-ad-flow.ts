
'use server';
/**
 * @fileOverview AI flow for generating ad copy.
 *
 * - generateAdCopy - A function that suggests ad copy variations.
 * - AdCopyInput - The input type for the generateAdCopy function.
 * - AdCopyOutput - The return type for the generateAdCopy function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AdCopyInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  offerDetails: z.string().describe('The details of the special offer.'),
  targetAudience: z.string().describe('The intended audience for the ad.'),
});
export type AdCopyInput = z.infer<typeof AdCopyInputSchema>;

const AdCopyOutputSchema = z.object({
  variations: z.array(z.string()).describe('A list of 3-5 compelling ad copy variations.'),
});
export type AdCopyOutput = z.infer<typeof AdCopyOutputSchema>;

const adCopyPrompt = ai.definePrompt({
  name: 'adCopyPrompt',
  input: { schema: AdCopyInputSchema },
  output: { schema: AdCopyOutputSchema },
  prompt: `You are an expert marketing copywriter specializing in short, punchy ads for local businesses.
    Your task is to generate a few compelling ad copy variations based on the provided details.
    Keep the tone engaging, friendly, and urgent to encourage customers to act fast.
    Focus on creating clear, concise, and attractive messages.

    Business Name: {{{businessName}}}
    Offer Details: {{{offerDetails}}}
    Target Audience: {{{targetAudience}}}
    
    Generate 3-4 distinct variations of ad copy. Each variation should be a single, short paragraph.
    `,
});

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: AdCopyInputSchema,
    outputSchema: AdCopyOutputSchema,
  },
  async (input) => {
    const { output } = await adCopyPrompt(input);
    return output!;
  }
);

export async function generateAdCopy(input: AdCopyInput): Promise<AdCopyOutput> {
  return generateAdCopyFlow(input);
}
