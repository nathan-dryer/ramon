
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScrapbookGrid } from './components/ScrapbookGrid';
import { FloatingCTA } from './components/FloatingCTA';
import { AdminIcon } from '@/components/auth/AdminIcon';
import Link from 'next/link';
import { PartyPopper, Loader2 } from 'lucide-react';
import type { ScrapbookItemData } from '@/types';

interface ScrapbookPageClientContentProps {
  initialItems: ScrapbookItemData[];
  isAdmin: boolean;
}

export function ScrapbookPageClientContent({ initialItems, isAdmin }: ScrapbookPageClientContentProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ScrapbookItemData[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDialogOpen, setInitialDialogOpen] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (searchParams.get('action') === 'leaveMessage') {
      setInitialDialogOpen(true);
    } else {
      setInitialDialogOpen(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-serif text-lg text-muted-foreground">
          Refreshing Surprises...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4">
        <Link href="/login" className="flex items-center space-x-2 group">
          <PartyPopper className="h-7 w-7 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
          <h1 className="font-display text-lg md:text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            Ramon's Wicked 50th!
          </h1>
        </Link>
        <AdminIcon isAuthenticated={isAdmin} key={isAdmin ? 'admin-logged-in-scrapbook' : 'admin-logged-out-scrapbook'} />
      </header>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12 relative">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3">
            💬 Ramon's Wicked 50th!
          </h1>
          <p className="font-serif text-lg sm:text-xl md:text-2xl text-muted-foreground mt-2 max-w-3xl mx-auto">
            Share a memory or message to help us celebrate Ramon's wicked 50th birthday!
          </p>
        </div>
        <ScrapbookGrid items={items} isAdmin={isAdmin} />
      </div>
      <FloatingCTA initialOpen={initialDialogOpen} />
    </div>
  );
}
