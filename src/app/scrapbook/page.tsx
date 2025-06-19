import { SiteHeader } from '@/components/layout/SiteHeader';
import { ScrapbookGrid } from './components/ScrapbookGrid';

export default function ScrapbookPage() {
  // In a real app, fetch items from a database or API
  // For now, ScrapbookGrid uses mock data

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl font-bold text-primary mb-3">
            Ramon's Digital Scrapbook
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of cherished memories, heartfelt messages, and special moments celebrating Ramon's 50th!
          </p>
        </div>
        <ScrapbookGrid items={[]} /> {/* Pass empty array to use mock data from component */}
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground font-body">
        &copy; {new Date().getFullYear()} Ramon's 50th Celebration. Made with ❤️.
      </footer>
    </div>
  );
}
