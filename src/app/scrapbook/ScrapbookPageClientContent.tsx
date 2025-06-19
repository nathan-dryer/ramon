
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScrapbookGrid } from './components/ScrapbookGrid';
import { getScrapbookItems } from './actions'; // Keep for potential refresh
import { FloatingCTA } from './components/FloatingCTA';
import { AdminIcon } from '@/components/auth/AdminIcon';
import Link from 'next/link';
import { PartyPopper, Loader2 } from 'lucide-react';
import type { ScrapbookItemData } from '@/types';
import { isAdminAuthenticated } from '@/lib/adminAuth'; // Keep for potential refresh


interface ScrapbookPageClientContentProps {
  initialIsAdmin: boolean;
  initialItems: ScrapbookItemData[];
}

export function ScrapbookPageClientContent({ initialIsAdmin, initialItems }: ScrapbookPageClientContentProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ScrapbookItemData[]>(initialItems);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [isLoading, setIsLoading] = useState(false); // Initial items are loaded, so false initially
  const [initialDialogOpen, setInitialDialogOpen] = useState(false);

  // Effect to re-fetch items or admin status if needed, e.g., after an action
  // This is a simplified example; you might want more specific triggers
  useEffect(() => {
    // Example: Re-check admin status if initialIsAdmin changes (e.g., after login/logout and refresh)
    setIsAdmin(initialIsAdmin);
  }, [initialIsAdmin]);

  useEffect(() => {
    // Update items if initialItems prop changes (e.g., after refresh)
    setItems(initialItems);
  }, [initialItems]);


  useEffect(() => {
    if (searchParams.get('action') === 'leaveMessage') {
      setInitialDialogOpen(true);
    } else {
      setInitialDialogOpen(false); 
    }
  }, [searchParams]);
  

  if (isLoading) { // This might be used if you have client-side re-fetching logic
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-body text-lg text-muted-foreground">Refreshing Surprises...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4">
        <Link href="/login" className="flex items-center space-x-2 group">
          <PartyPopper className="h-7 w-7 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
          <h1 className="font-headline text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            Ramon's 50th Jubilee
          </h1>
        </Link>
        <AdminIcon isAuthenticated={isAdmin} key={isAdmin ? 'admin-logged-in-scrapbook' : 'admin-logged-out-scrapbook'} />
      </header>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12 relative">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-3">
            💬 Messages From Friends
          </h1>
          <p className="font-body text-2xl md:text-3xl text-muted-foreground mt-2 max-w-2xl mx-auto">
            A collection of cherished memories, heartfelt messages, and special
            moments celebrating Ramon's 50th!
          </p>
        </div>
        <ScrapbookGrid items={items} isAdmin={isAdmin} />
      </div>
      <FloatingCTA initialOpen={initialDialogOpen} />
    </div>
  );
}

