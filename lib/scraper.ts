// lib/scraper.ts
import { getProvider } from "@/lib/providers/";
import type { ExtractedData } from "@/lib/providers/base-providers";

export async function extractLinkData(subLink: string): Promise<ExtractedData> {
  const provider = getProvider(subLink);

  if (!provider) {
    throw new Error(`No provider found for: ${subLink}`);
  }

  //   console.log(`Using provider: ${provider.getName()}`);

  return await provider.extractData(subLink);
}
