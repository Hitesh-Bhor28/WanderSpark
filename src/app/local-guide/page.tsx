
'use client';

import PageHeader from '@/components/PageHeader';
import { Compass } from 'lucide-react';

export default function LocalGuidePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeader title="AI Local Guide" description="Discover hidden gems and local secrets with our AI guide." />
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <Compass className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-2xl font-bold tracking-tight">
            AI Local Guide Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            Your personal AI guide to exploring new places is on the way.
          </p>
        </div>
      </div>
    </main>
  );
}
