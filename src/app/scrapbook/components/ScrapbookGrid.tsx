
import type { ScrapbookItemData } from '@/types';
import { Ghost } from 'lucide-react';
import { ScrapbookItemCard } from './ScrapbookItemCard';

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
    <div className="columns-1 sm:columns-2 gap-6 md:gap-8 p-0 md:p-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="mb-6 md:mb-8" // Add margin-bottom to create space between items in columns
          style={{ breakInside: 'avoid-column' }} // Prevent items from breaking across columns
        >
          <ScrapbookItemCard
            item={item}
            isAdmin={isAdmin}
            isPriority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
