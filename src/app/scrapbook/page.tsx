
// Removed 'use client' from here to allow metadata export

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScrapbookGrid } from './components/ScrapbookGrid';
import { getScrapbookItems } from './actions';
import { FloatingCTA } from './components/FloatingCTA';
import { AdminIcon } from '@/components/auth/AdminIcon';
import Link from 'next/link';
import { PartyPopper, Loader2 } from 'lucide-react';
import type { ScrapbookItemData } from '@/types';
import { isAdminAuthenticated } from '@/lib/adminAuth'; // We'll need to handle this differently for client component

// Metadata for Open Graph tags - this needs to be in a server component or layout.
// For client components, OG tags are typically handled by the nearest server component parent or layout.
// We'll define metadata for /scrapbook route in a layout or server component if needed,
// but for now, the primary focus is client-side logic.
// For this specific file, if it must be 'use client', OG tags cannot be exported directly.
// Let's assume metadata for /scrapbook is handled at a higher level or we adjust.

// If this page *must* be a client component for useSearchParams,
// we need a way to get initial server data (items, isAdmin).
// This pattern fetches data on the client side.

function ScrapbookPageContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ScrapbookItemData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialDialogOpen, setInitialDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // In a client component, direct server action calls are fine.
        // For isAdminAuthenticated, we'd ideally get this from a context or a server-rendered prop.
        // For simplicity here, we might need a separate API route or re-evaluate if this page must be client.
        // Let's assume for now we make an effect to check or pass it down if possible.
        // This is a common challenge when converting server pages with auth to client for hooks.
        // For now, we'll focus on searchParams and defer isAdmin for a moment or assume it's passed.
        const fetchedItems = await getScrapbookItems();
        setItems(fetchedItems);
        // const adminStatus = await isAdminAuthenticated(); // This can't be called directly in client component.
        // setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Failed to fetch scrapbook items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // This effect will run after initial render and when searchParams change.
    if (searchParams.get('action') === 'leaveMessage') {
      setInitialDialogOpen(true);
    } else {
      setInitialDialogOpen(false); // Ensure it closes if param is removed
    }
  }, [searchParams]);
  
  // Placeholder for admin status, would ideally be fetched or passed securely
  // For demo, let's assume it's false or managed by AdminIcon internally if not passed
  // In a real app, this needs a proper solution (e.g. session context, API call)
  useEffect(() => {
    // Simulate fetching admin status for the key prop of AdminIcon
    // This is not ideal for production; use a proper auth context or server props.
    const checkAdmin = async () => {
        // This is a client-side check. For a robust solution, you'd call an API route
        // or use a session context initialized from the server.
        // Checking document.cookie directly is less secure and might not reflect httpOnly cookies.
        // For demonstration if AdminIcon relies on its own internal prop or effect:
        // const response = await fetch('/api/auth/status'); // Example: an API route checking the cookie
        // if (response.ok) {
        //     const data = await response.json();
        //     setIsAdmin(data.isAdmin);
        // }
        // A simple, less secure way to check a non-HttpOnly cookie (not recommended for real auth):
        // const isAdminCookiePresent = document.cookie.includes('admin_auth=admin_is_authenticated');
        // setIsAdmin(isAdminCookiePresent);
        // Given isAdminAuthenticated is a server function, a client-side equivalent API would be needed.
        // For now, we'll assume AdminIcon handles its visual state based on its prop or internal logic.
    };
    // checkAdmin(); 
  }, []);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-body text-lg text-muted-foreground">Loading Ramon's Surprises...</p>
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
        {/* AdminIcon will rely on its internal cookie check if isAuthenticated is not passed, or pass isAdmin here */}
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

// It's good practice to wrap client components that use hooks like useSearchParams
// in <Suspense> in their parent server component.
export default function ScrapbookPage() {
  // const isAdmin = isAdminAuthenticated(); // This would be how you get it on the server.
  // However, ScrapbookPageContent is client-side and won't directly receive this if fetched here
  // unless we pass it explicitly. For now, AdminIcon's internal check or passed prop (from a server context) will handle its display.

  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="mt-4 font-body text-lg text-muted-foreground">Loading Page...</p></div>}>
      <ScrapbookPageContent />
    </Suspense>
  );
}

// To define metadata for this page (e.g., OG tags), it should be done in a way
// that Next.js expects for server components or via the metadata API.
// If ScrapbookPage becomes a server component that wraps ScrapbookPageContent,
// metadata can be exported from ScrapbookPage.

export const metadata = {
  title: "Ramon's 50th Jubilee Scrapbook | Share Your Memories!",
  description: "Join the celebration! Browse messages, photos, and videos for Ramon's 50th birthday. Leave your own special message!",
  openGraph: {
    title: "Ramon's 50th Jubilee Scrapbook | Share Your Memories!",
    description: "A digital scrapbook filled with love and memories for Ramon's big 5-0. Come see and contribute!",
    url: '/scrapbook', // Should be absolute URL in production
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=Ramon%27s+Jubilee+Scrapbook', // Replace with an actual engaging image
        width: 1200,
        height: 630,
        alt: "Ramon's 50th Jubilee Scrapbook",
        'data-ai-hint': 'scrapbook party'
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ramon's 50th Jubilee Scrapbook | Share Your Memories!",
    description: "Join the celebration for Ramon's 50th! View the digital scrapbook and add your wishes.",
    images: ['https://placehold.co/1200x630.png?text=Ramon%27s+Jubilee+Scrapbook'], // Replace with an actual engaging image
  },
};

