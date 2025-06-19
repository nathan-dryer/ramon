import type { ScrapbookItemData } from '@/types';
import { ScrapbookItemCard } from './ScrapbookItemCard';

interface ScrapbookGridProps {
  items: ScrapbookItemData[];
}

// Mock data for scrapbook items
const mockScrapbookItems: ScrapbookItemData[] = [
  {
    id: '1',
    type: 'message',
    contributor: 'Aunt Maria',
    title: 'Happy Birthday Ramon!',
    content: "Dearest Ramon,\nWishing you the happiest of birthdays! May this milestone year be filled with joy, laughter, and unforgettable memories. We love you!\n\nWarmly,\nAunt Maria & Uncle John",
    timestamp: '2024-07-15T10:00:00Z',
    accentColor: 'magenta',
  },
  {
    id: '2',
    type: 'photo',
    contributor: 'Cousin Sofia',
    title: 'Throwback to Summer 2005!',
    content: 'https://placehold.co/600x400.png', // Placeholder image
    timestamp: '2024-07-15T11:30:00Z',
    accentColor: 'gold',
  },
  {
    id: '3',
    type: 'video',
    contributor: 'The Kids',
    title: 'A Special Message for Dad!',
    content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video (Rick Astley)
    timestamp: '2024-07-15T14:15:00Z',
    accentColor: 'magenta',
  },
  {
    id: '4',
    type: 'message',
    contributor: 'Old College Friends',
    title: 'Cheers to 50 Years!',
    content: "Ramon, old buddy! Can you believe it's been 50 years? Feels like just yesterday we were cramming for finals. Hope you have an amazing celebration. We'll raise a glass to you from afar!\n\nBest,\nMike, Dave, and Sarah",
    timestamp: '2024-07-16T09:00:00Z',
    accentColor: 'gold',
  },
   {
    id: '5',
    type: 'photo',
    contributor: 'Mom & Dad',
    title: 'Our Wonderful Son',
    content: 'https://placehold.co/600x450.png',
    timestamp: '2024-07-16T10:00:00Z',
    accentColor: 'magenta',
  },
  {
    id: '6',
    type: 'message',
    contributor: 'Your Work Team',
    title: 'Happy 50th, Ramon!',
    content: "To our fearless leader and great colleague, Ramon! Wishing you a fantastic 50th birthday. Thanks for everything you do. Enjoy your special day!\n\nFrom all of us at Acme Corp.",
    timestamp: '2024-07-16T11:00:00Z',
    accentColor: 'gold',
  }
];


export function ScrapbookGrid({ items = mockScrapbookItems }: ScrapbookGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="font-headline text-2xl text-muted-foreground">The Scrapbook is Empty</h2>
        <p className="font-body text-muted-foreground mt-2">Check back soon for messages, photos, and videos!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-8">
      {items.map((item) => (
        <ScrapbookItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
