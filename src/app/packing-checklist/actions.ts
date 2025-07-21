
'use server';

import { generatePackingList, type GeneratePackingListInput } from '@/ai/flows/generate-packing-list';
import { z } from 'zod';

const packingListSchema = z.object({
  destination: z.string(),
  duration: z.number(),
  climate: z.string(),
  tripType: z.string(),
  transportMode: z.string(),
  preferences: z.string().optional(),
});

export async function handlePackingListGeneration(data: GeneratePackingListInput) {
  const validatedData = packingListSchema.parse(data);
  return await generatePackingList(validatedData);
}
