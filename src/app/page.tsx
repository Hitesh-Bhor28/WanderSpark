
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ItineraryPlanner = dynamic(() => import('@/app/itinerary-planner'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 p-4 lg:p-6">
        <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-[700px] w-full" />
        </div>
        <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[700px] w-full" />
        </div>
    </div>
  )
})

export default function ItineraryPlannerPage() {
  return (
    <ItineraryPlanner />
  );
}
