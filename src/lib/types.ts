import { z } from 'zod';

export const GenerateItineraryInputSchema = z.object({
  source: z.string().describe('The starting place for the trip.'),
  destination: z.string().describe('The destination for the trip.'),
  duration: z.number().int().min(1).describe('The duration of the trip in days.'),
  tripType: z.enum(['solo', 'family', 'adventure', 'business']).describe('The type of trip.'),
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const ActivitySchema = z.object({
  title: z.string().describe('The title of the activity or place.'),
  description: z.string().describe('A brief, engaging description of the activity (4-5 sentences).'),
  type: z.enum(['Attraction', 'Food', 'Activity', 'Travel', 'Shopping']).describe('The category of the activity.'),
  timeOfDay: z.enum(['Morning', 'Afternoon', 'Evening']).describe('Recommended time of day for the activity.'),
});

const DailyItinerarySchema = z.object({
  day: z.number().int().min(1).describe('The day number of the itinerary (e.g., 1, 2, 3).'),
  theme: z.string().describe('A creative theme for the day (e.g., "Historical Exploration", "Culinary Delights").'),
  activities: z.array(ActivitySchema).describe('A list of activities for the day.'),
});

export const TravelSuggestionSchema = z.object({
  mode: z.enum(['Flight', 'Train', 'Bus', 'Car']).describe('The mode of transport.'),
  details: z.string().describe('Specific details like airline, train name, or bus operator.'),
  price: z.number().describe('The estimated price in Indian Rupees (RS).'),
  duration: z.string().describe('The estimated travel duration.'),
});
export type TravelSuggestion = z.infer<typeof TravelSuggestionSchema>;

export const StaySuggestionSchema = z.object({
  name: z.string().describe('The name of the accommodation.'),
  type: z.enum(['Hotel', 'Hostel', 'Resort', 'Boutique Hotel', 'Apartment']).describe('The type of accommodation.'),
  rating: z.number().describe('The user rating out of 5.'),
  price: z.number().describe('The estimated price per night in Indian Rupees (RS).'),
});
export type StaySuggestion = z.infer<typeof StaySuggestionSchema>;


export const ItinerarySchema = z.object({
  dailyItineraries: z.array(DailyItinerarySchema).describe('An array of daily itineraries for the trip.'),
  travelSuggestions: z.array(TravelSuggestionSchema).optional().describe('A list of the best travel suggestions from the source to the destination.'),
  staySuggestions: z.array(StaySuggestionSchema).optional().describe('A list of stay suggestions at the destination.'),
});
export type Itinerary = z.infer<typeof ItinerarySchema>;

export const RefineItineraryInputSchema = z.object({
  itinerary: ItinerarySchema,
  selectedTravel: TravelSuggestionSchema,
});
export type RefineItineraryInput = z.infer<typeof RefineItineraryInputSchema>;
