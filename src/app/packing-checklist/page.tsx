
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handlePackingListGeneration } from './actions';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type GeneratePackingListOutput } from '@/ai/flows/generate-packing-list';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const packingListSchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 day'),
  climate: z.string().min(2, 'Climate is required'),
  tripType: z.string().min(2, 'Trip type is required'),
  transportMode: z.string({ required_error: 'Transport mode is required.' }),
});

type PackingListValues = z.infer<typeof packingListSchema>;

const ChecklistItem = ({ item, id }: { item: string; id: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} />
      <Label htmlFor={id} className="font-normal">
        {item}
      </Label>
    </div>
  );
};

export default function PackingChecklistPage() {
  const [result, setResult] = useState<GeneratePackingListOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PackingListValues>({
    resolver: zodResolver(packingListSchema),
    defaultValues: { destination: '', duration: 7, climate: '', tripType: '' },
  });

  async function onSubmit(data: PackingListValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await handlePackingListGeneration(data);
      setResult(res);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate packing list.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
       <PageHeader
        title="Smart Packing Checklist"
        description="Generate a personalized packing list for your trip."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Packing List Generator</CardTitle>
            <CardDescription>Enter your trip details to get a customized packing list.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="destination" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="e.g. Manali, India" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="duration" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Duration (days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="climate" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Climate</FormLabel><FormControl><Input placeholder="e.g. Cold, Tropical, Desert" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="tripType" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Trip Type</FormLabel><FormControl><Input placeholder="e.g. Adventure, Business, Leisure" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField
                  control={form.control}
                  name="transportMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode of Transport</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your transport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Flight">Flight</SelectItem>
                          <SelectItem value="Train">Train</SelectItem>
                          <SelectItem value="Bus">Bus</SelectItem>
                          <SelectItem value="Car">Car</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><ListChecks className="mr-2 h-4 w-4"/>Generate List</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Your Custom List</CardTitle>
            <CardDescription>Check off items as you pack them.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <div className="flex justify-center pt-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {result && (
              <Accordion type="multiple" defaultValue={['essentials', 'packing', 'tips']} className="w-full">
                <AccordionItem value="essentials">
                  <AccordionTrigger>Essential Checklist</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {result.essentialChecklist.map((item, i) => (
                        <ChecklistItem key={`essential-${i}`} item={item} id={`essential-${i}`} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="packing">
                  <AccordionTrigger>Packing List</AccordionTrigger>
                  <AccordionContent>
                     <div className="space-y-2">
                        {result.packingList.map((item, i) => (
                          <ChecklistItem key={`packing-${i}`} item={item} id={`packing-${i}`} />
                        ))}
                      </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tips">
                  <AccordionTrigger>Safe Travel Tips</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc space-y-1 pl-5">{result.safeTravelTips.map((item, i) => <li key={i}>{item}</li>)}</ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            {!result && !isLoading && (
                 <div className="flex flex-col items-center justify-center space-y-4 pt-16 text-center">
                    <p className="text-muted-foreground">Your packing list will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
