
'use server';

/**
 * @fileOverview Generates a travel itinerary based on user inputs.
 */

import { ai } from '@/ai/genkit';
import { GenerateItineraryInputSchema, ItinerarySchema, RefineItineraryInputSchema, type GenerateItineraryInput, type Itinerary, type RefineItineraryInput, TravelSuggestionSchema, StaySuggestionSchema } from '@/lib/types';
import { z } from 'zod';


export async function generateItinerary(input: GenerateItineraryInput): Promise<Itinerary> {
  return generateItineraryFlow(input);
}

export async function refineItinerary(input: RefineItineraryInput): Promise<Itinerary> {
  return refineItineraryFlow(input);
}

const findBestStay = ai.defineTool(
  {
    name: 'findBestStay',
    description: 'Find the best stay options like hotels, hostels, etc., from various booking websites for a given destination.',
    inputSchema: z.object({
      destination: z.string(),
    }),
    outputSchema: z.array(StaySuggestionSchema),
  },
  async ({ destination }) => {
    // In a real app, this would call booking APIs.
    // Here we return dummy data.
    console.log(`Finding best stay options in ${destination}`);
    return [
      {
        name: 'Grand Heritage Hotel',
        type: 'Hotel',
        rating: 4.5,
        price: Math.floor(Math.random() * 5000) + 4000,
      },
      {
        name: 'The Backpacker Hostel',
        type: 'Hostel',
        rating: 4.2,
        price: Math.floor(Math.random() * 800) + 800,
      },
      {
        name: 'Ocean View Resort',
        type: 'Resort',
        rating: 4.8,
        price: Math.floor(Math.random() * 8000) + 10000,
      },
      {
        name: 'Cozy Inn Boutique',
        type: 'Boutique Hotel',
        rating: 4.6,
        price: Math.floor(Math.random() * 4000) + 6000,
      },
    ];
  }
);


const getTravelSuggestions = ai.defineTool(
  {
    name: 'getTravelSuggestions',
    description: 'Get a list of the best travel suggestions (flights, trains, buses) between two locations.',
    inputSchema: z.object({
      source: z.string(),
      destination: z.string(),
    }),
    outputSchema: z.array(TravelSuggestionSchema),
  },
  async ({ source, destination }) => {
    // In a real app, this would call travel APIs.
    // Here we return dummy data for different travel modes.
    console.log(`Getting best travel suggestions from ${source} to ${destination}`);
    return [
      // Flights
      {
        mode: 'Flight',
        details: 'IndiGo',
        price: Math.floor(Math.random() * 4000) + 3500,
        duration: `${(Math.random() * 2 + 1.5).toFixed(1)} hours`,
      },
      {
        mode: 'Flight',
        details: 'Air India',
        price: Math.floor(Math.random() * 4000) + 4000,
        duration: `${(Math.random() * 2 + 1.6).toFixed(1)} hours`,
      },
      // Trains
      {
        mode: 'Train',
        details: 'Shatabdi Express',
        price: Math.floor(Math.random() * 1500) + 800,
        duration: `${(Math.random() * 10 + 8).toFixed(1)} hours`,
      },
      {
        mode: 'Train',
        details: 'Rajdhani Express',
        price: Math.floor(Math.random() * 2000) + 1200,
        duration: `${(Math.random() * 10 + 7.5).toFixed(1)} hours`,
      },
      // Buses
      {
        mode: 'Bus',
        details: 'Volvo Sleeper',
        price: Math.floor(Math.random() * 800) + 500,
        duration: `${(Math.random() * 12 + 10).toFixed(1)} hours`,
      },
      {
        mode: 'Bus',
        details: 'State Transport',
        price: Math.floor(Math.random() * 600) + 300,
        duration: `${(Math.random() * 12 + 11).toFixed(1)} hours`,
      },
    ];
  }
);


const generateItineraryPrompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: { schema: GenerateItineraryInputSchema },
  output: { schema: ItinerarySchema },
  tools: [getTravelSuggestions, findBestStay],
  prompt: `You are an expert travel planner. Generate a detailed, day-by-day itinerary for a trip based on the user's input. The prices must be in Indian Rupees (RS).

  First, use the getTravelSuggestions tool to find the best flight, train, and bus options from the source to the destination.
  Second, use the findBestStay tool to find accommodation options at the destination.
  Include all of these suggestions in your final output.

  Starting Place: {{{source}}}
  Destination: {{{destination}}}
  Duration: {{{duration}}} days
  Trip Type: {{{tripType}}}

  For each day, provide a theme and a list of activities (3-4 per day). Each activity should have a title, a much more detailed and engaging description (4-5 sentences), a type, and a recommended time of day.
  
  IMPORTANT: The 'timeOfDay' for an activity MUST be one of 'Morning', 'Afternoon', or 'Evening'. Do NOT combine them (e.g., do not use "Morning/Afternoon").

  Consider the travel from the starting place to the destination in your suggestions. For example, the first and last day might have fewer activities to account for travel time.

  Ensure the itinerary is logical, geographically sensible, and tailored to the trip type. For 'family' trips, include kid-friendly options. For 'adventure', include exciting activities. For 'business', include some time for work but also leisure.
  `,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: ItinerarySchema,
  },
  async (input) => {
    const { output } = await generateItineraryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate itinerary.');
    }
    return output;
  }
);


const refineItineraryPrompt = ai.definePrompt({
  name: 'refineItineraryPrompt',
  input: { schema: z.object({
    itineraryJson: z.string(),
    selectedTravel: TravelSuggestionSchema,
  }) },
  output: { schema: ItinerarySchema },
  prompt: `You are an expert travel planner. A user has an existing itinerary and has chosen a specific travel option.
  Your task is to refine the itinerary, especially the first and last days, to account for the travel time.

  Selected Travel Option:
  - Mode: {{{selectedTravel.mode}}}
  - Details: {{{selectedTravel.details}}}
  - Duration: {{{selectedTravel.duration}}}
  - Price: {{{selectedTravel.price}}}

  Original Itinerary (in JSON format):
  {{{itineraryJson}}}

  Based on the travel duration, adjust the activities on the first and last day. For example, if travel takes a long time, there should be fewer activities on those days.
  Return the complete, refined itinerary in the same format as the original. Do not change the travel or stay suggestions from the original itinerary.
  `
});

const refineItineraryFlow = ai.defineFlow(
  {
    name: 'refineItineraryFlow',
    inputSchema: RefineItineraryInputSchema,
    outputSchema: ItinerarySchema,
  },
  async (input) => {
    const { output } = await refineItineraryPrompt({
      itineraryJson: JSON.stringify(input.itinerary),
      selectedTravel: input.selectedTravel,
    });
    if (!output) {
      throw new Error('Failed to refine itinerary.');
    }
    // The travel and stay suggestions should be preserved from the original itinerary
    output.travelSuggestions = input.itinerary.travelSuggestions;
    output.staySuggestions = input.itinerary.staySuggestions;
    return output;
  }
);
