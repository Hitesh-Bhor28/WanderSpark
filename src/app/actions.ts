
'use server';

import {
  generateItinerary,
  refineItinerary,
  type GenerateItineraryInput,
  type Itinerary,
  type RefineItineraryInput,
} from '@/ai/flows/generate-itinerary';
import { ItinerarySchema, RefineItineraryInputSchema, TravelSuggestionSchema } from '@/lib/types';
import { z } from 'zod';
import { differenceInDays } from 'date-fns';

const itineraryFormSchema = z.object({
  source: z.string(),
  destination: z.string(),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  tripType: z.enum(['solo', 'family', 'adventure', 'business']),
});

export async function handleItineraryGeneration(
  data: z.infer<typeof itineraryFormSchema>
): Promise<Itinerary> {
  const validatedData = itineraryFormSchema.parse(data);

  const duration = differenceInDays(validatedData.dates.to, validatedData.dates.from) + 1;
  
  if (duration <= 0) {
    throw new Error('End date must be after start date.');
  }

  const input: GenerateItineraryInput = {
    source: validatedData.source,
    destination: validatedData.destination,
    duration: duration,
    tripType: validatedData.tripType,
  };

  const result = await generateItinerary(input);
  return result;
}

export async function handleItineraryRefinement(
  data: RefineItineraryInput
): Promise<Itinerary> {
  const validatedData = RefineItineraryInputSchema.parse(data);
  const result = await refineItinerary(validatedData);
  return result;
}
