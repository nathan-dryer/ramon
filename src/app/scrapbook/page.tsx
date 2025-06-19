import { SiteHeader } from '@/components/layout/SiteHeader';
import { ScrapbookGrid } from './components/ScrapbookGrid';
import { getScrapbookItems } from './actions';
import { LeaveMessageDialog } from './components/LeaveMessageDialog';
import { Disc3 } from 'lucide-react';

export default async function ScrapbookPage() {
  const items = await getScrapbookItems();

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12 relative">
           <Disc3 className="absolute -top-10 -left-20 h-32 w-32 text-accent2-DEFAULT/20 animate-pulse opacity-50 transform rotate-[15deg] hidden md:block" />
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-foreground mb-3 text-shadow-accent1">
            Ramon's Digital Scrapbook
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of cherished memories, heartfelt messages, and special moments celebrating Ramon's 50th!
          </p>
           <Disc3 className="absolute -bottom-10 -right-20 h-28 w-28 text-accent1-DEFAULT/20 animate-pulse opacity-50 transform rotate-[-25deg] hidden md:block" />
        </div>

        <div className="mb-12 text-center">
          <LeaveMessageDialog />
        </div>

        <ScrapbookGrid items={items} />
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground font-body border-t border-border/30">
        &copy; {new Date().getFullYear()} Ramon's 50th Celebration. Made with ❤️ and Neon Lights.
      </footer>
    </div>
  );
}
