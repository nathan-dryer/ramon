
import { ScrapbookGrid } from './components/ScrapbookGrid';
import { getScrapbookItems } from './actions';
import { FloatingCTA } from './components/FloatingCTA';
import { AdminIcon } from '@/components/auth/AdminIcon';
import Link from 'next/link';
import { PartyPopper } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export default async function ScrapbookPage() {
  const items = await getScrapbookItems();
  const isAdmin = isAdminAuthenticated();

  return (
    <div className="flex flex-col min-h-screen"> 
      <header className="flex justify-between items-center p-4">
        <Link href="/scrapbook" className="flex items-center space-x-2 group">
          <PartyPopper className="h-7 w-7 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
          <h1 className="font-headline text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            Ramon's 50th Jubilee
          </h1>
        </Link>
        <AdminIcon />
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
      <FloatingCTA />
    </div>
  );
}
