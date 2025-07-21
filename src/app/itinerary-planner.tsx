
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleItineraryGeneration, handleItineraryRefinement } from './actions';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Calendar as CalendarIcon, Clock, Utensils, FerrisWheel, Sun, Moon, Plane, Train, Bus, Car, Sparkles, Hotel, Star } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Itinerary, StaySuggestion, TravelSuggestion } from '@/lib/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const itineraryFormSchema = z.object({
  source: z.string().min(2, { message: 'Starting place must be at least 2 characters.' }),
  destination: z.string().min(2, { message: 'Destination must be at least 2 characters.' }),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  tripType: z.enum(['solo', 'family', 'adventure', 'business']),
});

type ItineraryFormValues = z.infer<typeof itineraryFormSchema>;

const iconMap: { [key: string]: React.ElementType } = {
  Attraction: FerrisWheel,
  Food: Utensils,
  Morning: Sun,
  Afternoon: Sun,
  Evening: Moon,
  Default: Wand2,
};

const travelIconMap: { [key: string]: React.ElementType } = {
  Flight: Plane,
  Train: Train,
  Bus: Bus,
  Car: Car,
};

export default function ItineraryPlanner() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [selectedTravel, setSelectedTravel] = useState<TravelSuggestion | null>(null);
  const { toast } = useToast();

  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: {
      source: '',
      destination: '',
      tripType: 'adventure',
      dates: { from: new Date(), to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
    },
  });

  async function onSubmit(data: ItineraryFormValues) {
    setIsLoading(true);
    setItinerary(null);
    setSelectedTravel(null);
    try {
      const result = await handleItineraryGeneration(data);
      setItinerary(result);
    } catch (error) {
       console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error generating itinerary',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function onRefine() {
    if (!itinerary || !selectedTravel) return;
    setIsRefining(true);
    try {
      const result = await handleItineraryRefinement({ itinerary, selectedTravel });
      setItinerary(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error refining itinerary',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsRefining(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeader
        title="AI Itinerary Planner"
        description="Let our AI craft the perfect travel plan for your next adventure."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Provide the details for your trip.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Place</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mumbai, India" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Goa, India" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Travel Dates</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                              >
                                {field.value?.from ? (
                                  field.value.to ? (
                                    <>
                                      {format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}
                                    </>
                                  ) : (
                                    format(field.value.from, 'LLL dd, y')
                                  )
                                ) : (
                                  <span>Pick a date range</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="range"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tripType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a trip type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="solo">Solo</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Itinerary
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[600px]">
            <CardHeader>
              <CardTitle>Your Custom Itinerary</CardTitle>
              <CardDescription>
                Here is your AI-generated travel plan. Select a travel option to refine it.
              </CardDescription>
            </CardHeader>
            <CardContent>
            <ScrollArea className="h-[calc(100vh-220px)] w-full">
              {isLoading && (
                <div className="flex flex-col items-center justify-center space-y-4 pt-16">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Crafting your perfect trip...</p>
                </div>
              )}
              {itinerary && (
                 <div className="space-y-6">
                 {itinerary.travelSuggestions && itinerary.travelSuggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Travel Suggestions</CardTitle>
                      <CardDescription>Estimated prices and durations from {form.getValues().source} to {form.getValues().destination}. Click to select.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {itinerary.travelSuggestions.map((suggestion, index) => {
                        const Icon = travelIconMap[suggestion.mode];
                        const isSelected = selectedTravel === suggestion;
                        return (
                          <div 
                            key={index} 
                            className={cn(
                              "flex items-center gap-4 rounded-md border p-3 cursor-pointer transition-colors",
                              isSelected ? "border-primary ring-2 ring-primary/50" : "hover:bg-accent/50"
                            )}
                            onClick={() => setSelectedTravel(suggestion)}
                          >
                            {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
                            <div>
                              <p className="font-semibold">{suggestion.mode}: {suggestion.details}</p>
                              <p className="text-sm text-muted-foreground">
                                RS {suggestion.price.toLocaleString()} &bull; {suggestion.duration}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                    {selectedTravel && (
                      <CardContent>
                        <Button onClick={onRefine} disabled={isRefining} className="w-full">
                           {isRefining ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Refining...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Refine Itinerary with {selectedTravel.mode}
                            </>
                          )}
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                 )}
                 {itinerary.staySuggestions && itinerary.staySuggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Stay Suggestions</CardTitle>
                      <CardDescription>Recommended places to stay in {form.getValues().destination}.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {itinerary.staySuggestions.map((stay, index) => (
                        <div key={index} className="flex items-start gap-4 rounded-md border p-3">
                          <Hotel className="h-8 w-8 text-muted-foreground mt-1" />
                          <div>
                            <p className="font-semibold">{stay.name}</p>
                            <p className="text-sm text-muted-foreground">{stay.type}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-semibold">{stay.rating}</span>
                              <span className="text-sm text-muted-foreground mx-1">&bull;</span>
                              <span className="font-semibold">RS {stay.price.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground">/night</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                 )}
                 {itinerary.dailyItineraries.map((day, dayIndex) => (
                   <div key={dayIndex}>
                     <h3 className="font-headline text-xl font-semibold mb-3">Day {day.day}: {day.theme}</h3>
                     <div className="border-l-2 border-primary/50 pl-6 space-y-6">
                       {day.activities.map((activity, activityIndex) => {
                         const Icon = iconMap[activity.type] || iconMap.Default;
                         const TimeIcon = iconMap[activity.timeOfDay] || Clock;
                         return (
                           <div key={activityIndex} className="relative">
                              <div className="absolute -left-[34px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                               <p className="font-semibold text-primary flex items-center gap-2 mb-1">
                                 <TimeIcon className="h-4 w-4"/> {activity.timeOfDay}
                               </p>
                              <p className="font-semibold flex items-center gap-2"><Icon className="h-4 w-4"/> {activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 ))}
               </div>
              )}
              {!isLoading && !itinerary && (
                <div className="flex flex-col items-center justify-center space-y-4 pt-16 text-center">
                  <p className="text-muted-foreground">Your itinerary will appear here once generated.</p>
                </div>
              )}
              <ScrollBar orientation="vertical" />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
