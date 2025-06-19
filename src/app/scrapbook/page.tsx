
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ScrapbookGrid } from './components/ScrapbookGrid';
import { getScrapbookItems } from './actions';
import { LeaveMessageDialog } from './components/LeaveMessageDialog';
// Removed Disc3 as it may not fit the new minimal theme

export default async function ScrapbookPage() {
  const items = await getScrapbookItems();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12 relative">
          {/* Removed Disc3 icons */}
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-3">
            Ramon's Digital Scrapbook
          </h1>
          <p className="font-body text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of cherished memories, heartfelt messages, and special moments celebrating Ramon's 50th!
          </p>
        </div>

        <div className="mb-12 text-center">
          <LeaveMessageDialog />
        </div>

        <ScrapbookGrid items={items} />
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground font-body border-t">
        &copy; {new Date().getFullYear()} Ramon's 50th Celebration.
      </footer>
    </div>
  );
}
