
import type { ScrapbookItemData } from '@/types';
import { ScrapbookItemCard } from './ScrapbookItemCard';
import { Ghost } from 'lucide-react';

interface ScrapbookGridProps {
  items: ScrapbookItemData[];
  isAdmin?: boolean;
}

export function ScrapbookGrid({ items, isAdmin }: ScrapbookGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8 border-2 border-dashed border-border rounded-lg bg-card/50">
        <Ghost className="h-16 w-16 text-muted-foreground mb-4 animate-bounce" />
        <h2 className="font-headline text-2xl text-muted-foreground">The Scrapbook is Eerily Empty...</h2>
        <p className="font-body text-muted-foreground mt-2">Be the first to leave a message or check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-0 md:p-4">
      {items.map((item) => (
        <ScrapbookItemCard key={item.id} item={item} isAdmin={isAdmin} />
      ))}
    </div>
  );
}
