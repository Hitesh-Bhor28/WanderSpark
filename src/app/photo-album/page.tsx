
'use client';

import PageHeader from '@/components/PageHeader';
import { Camera } from 'lucide-react';

export default function PhotoAlbumPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeader title="Photo Album" description="Organize and showcase your best travel photos." />
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <Camera className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-2xl font-bold tracking-tight">
            Photo Album Feature Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            A beautiful way to remember your journeys is being built.
          </p>
        </div>
      </div>
    </main>
  );
}
