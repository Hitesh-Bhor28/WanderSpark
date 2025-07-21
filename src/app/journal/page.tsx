
'use client';

import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function JournalPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeader title="Travel Journal" description="A place to document your adventures and memories." />
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-2xl font-bold tracking-tight">
            Journal Feature Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            Get ready to write down your travel stories.
          </p>
        </div>
      </div>
    </main>
  );
}
