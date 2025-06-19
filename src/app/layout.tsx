
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/layout/Footer';

// Default metadata for the entire application
// Specific pages can override or extend this
export const metadata: Metadata = {
  title: {
    default: "Ramon's 50th Celebration!",
    template: "%s | Ramon's 50th",
  },
  description: "Join us in celebrating Ramon's 50th Birthday! Share messages, photos, and memories in this special digital scrapbook. Bongga Kaayo!",
  openGraph: {
    title: "Ramon's 50th Celebration!",
    description: "A special digital scrapbook for Ramon's 50th. Join the party!",
    // url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002', // Use environment variable for base URL
    images: [
      {
        url: `https://placehold.co/1200x630.png?text=Ramon%27s+BIG+50th%21`, // General fallback OG image
        width: 1200,
        height: 630,
        alt: "Ramon's 50th Birthday Celebration",
        'data-ai-hint': 'birthday party celebration',
      },
    ],
    type: 'website',
    siteName: "Ramon's 50th Celebration!",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ramon's 50th Celebration!",
    description: "Help celebrate Ramon's 50th! Share your memories.",
    // images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`], // General fallback OG image for Twitter
  },
  // Consider adding manifest, icons, theme color for PWA-like features if desired later
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Merienda:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased text-foreground bg-background">
        <div className="relative min-h-screen flex flex-col">
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
