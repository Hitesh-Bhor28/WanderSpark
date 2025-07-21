
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import WanderSparkLogo from '@/components/WanderSparkLogo';
import { Map, ListChecks, PieChart, Menu, Book, Compass, Camera } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'WanderSpark - Travel Planner',
  description: 'Plan and organize your travel itinerary with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarHeader>
                <WanderSparkLogo />
              </SidebarHeader>
              <SidebarMenu className="p-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <Map />
                      <span>Itinerary Planner</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/packing-checklist">
                      <ListChecks />
                      <span>Packing Checklist</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/budget-tracker">
                      <PieChart />
                      <span>Budget Tracker</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarSeparator className="my-1" />
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/journal">
                      <Book />
                      <span>Journal</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/local-guide">
                      <Compass />
                      <span>Local Guide</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/photo-album">
                      <Camera />
                      <span>Photo Album</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
              <WanderSparkLogo />
              <SidebarTrigger asChild>
                <Button size="icon" variant="outline">
                  <Menu />
                </Button>
              </SidebarTrigger>
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
