"use server";

import { generateAdCopy, type GenerateAdCopyInput, type GenerateAdCopyOutput } from "@/ai/flows/generate-ad-copy";

export async function handleGenerateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  try {
    const result = await generateAdCopy(input);
    return result;
  } catch (error) {
    console.error("Error in handleGenerateAdCopy:", error);
    // You might want to return a more structured error object
    return { adCopyVariations: [] };
  }
}
