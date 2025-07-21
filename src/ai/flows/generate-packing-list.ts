
'use server';

/**
 * @fileOverview A packing list generator AI agent.
 *
 * - generatePackingList - A function that handles the packing list generation process.
 * - GeneratePackingListInput - The input type for the generatePackingList function.
 * - GeneratePackingListOutput - The return type for the generatePackingList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePackingListInputSchema = z.object({
  destination: z.string().describe('The destination for the trip.'),
  duration: z.number().describe('The duration of the trip in days.'),
  climate: z.string().describe('The climate of the destination (e.g., tropical, temperate, desert).'),
  tripType: z.string().describe('The type of trip (e.g., adventure, business, leisure).'),
  transportMode: z.string().describe('The mode of transport for the trip (e.g., Flight, Train, Bus, Car).'),
  preferences: z.string().optional().describe('Any specific preferences or needs for packing.'),
});
export type GeneratePackingListInput = z.infer<typeof GeneratePackingListInputSchema>;

const GeneratePackingListOutputSchema = z.object({
  packingList: z.array(z.string()).describe('A list of items to pack for the trip.'),
  essentialChecklist: z.array(z.string()).describe('An essential checklist for the trip (e.g., passport, visa).'),
  safeTravelTips: z.array(z.string()).describe('Safe travel tips for the destination.'),
});
export type GeneratePackingListOutput = z.infer<typeof GeneratePackingListOutputSchema>;

export async function generatePackingList(input: GeneratePackingListInput): Promise<GeneratePackingListOutput> {
  return generatePackingListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePackingListPrompt',
  input: {schema: GeneratePackingListInputSchema},
  output: {schema: GeneratePackingListOutputSchema},
  prompt: `You are a travel expert assisting users in generating a packing list for their trip.

  Your suggestions must be highly relevant to the user's input.

  Destination: {{destination}}
  Duration: {{duration}} days
  Climate: {{climate}}
  Trip Type: {{tripType}}
  Transport Mode: {{transportMode}}
  Preferences: {{preferences}}

  Generate a packing list suitable for the specified trip.
  First, provide an "Essential Checklist" with critical items. This list must be tailored to the transport mode. For example, 'Flight' might require flight tickets and a passport, while 'Car' would require driving licenses and vehicle documents. Do not suggest flight-related items for car travel.
  Second, provide the main "Packing List" with clothing, accessories, and other necessary items, considering the climate, trip type, and transport mode (e.g., luggage restrictions for flights).
  Finally, provide some "Safe Travel Tips" for the destination.
  `,
});

const generatePackingListFlow = ai.defineFlow(
  {
    name: 'generatePackingListFlow',
    inputSchema: GeneratePackingListInputSchema,
    outputSchema: GeneratePackingListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

