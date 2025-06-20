
import { Suspense } from 'react';
import { getScrapbookItems } from './actions';
import { Loader2 } from 'lucide-react'; 
import { isAdminAuthenticated } from '@/lib/adminAuth';
import type { Metadata } from 'next';
import { ScrapbookPageClientContent } from './ScrapbookPageClientContent';


export const metadata: Metadata = {
  title: "Ramon's 50th Jubilee Scrapbook | Share Your Memories!",
  description: "Join the celebration! Browse messages, photos, and videos for Ramon's 50th birthday. Leave your own special message!",
  openGraph: {
    title: "Ramon's 50th Jubilee Scrapbook | Share Your Memories!",
    description: "A digital scrapbook filled with love and memories for Ramon's big 5-0. Come see and contribute!",
    // url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/scrapbook`,
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=Ramon%27s+Jubilee+Scrapbook',
        width: 1200,
        height: 630,
        alt: "Ramon's 50th Jubilee Scrapbook",
        'data-ai-hint': 'scrapbook party'
      },
    ],
    type: 'website',
    siteName: "Ramon's 50th Celebration!",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ramon's 50th Jubilee Scrapbook | Share Your Memories!",
    description: "Join the celebration for Ramon's 50th! View the digital scrapbook and add your wishes.",
    images: ['https://placehold.co/1200x630.png?text=Ramon%27s+Jubilee+Scrapbook'],
  },
};

// This Server Component wraps the Client Component that uses hooks
export default async function ScrapbookPage() {
  const initialItems = await getScrapbookItems(); // Fetch initial items on server
  const isAdmin = await isAdminAuthenticated(); // Fetch admin status on server

  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-body text-lg text-muted-foreground">Loading Page...</p>
      </div>
    }>
      <ScrapbookPageClientContent 
        initialItems={initialItems} 
        isAdmin={isAdmin}
      />
    </Suspense>
  );
}
