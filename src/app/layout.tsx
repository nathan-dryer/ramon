
import type { Metadata } from 'next';
import { Inter as FontSans, Merienda as FontSerif, Belleza as FontDisplay } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import ErrorBoundary from '@/components/ErrorBoundary';

// Font configuration
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ['400', '700']
});

const fontDisplay = FontDisplay({
    subsets: ["latin"],
    variable: "--font-display",
    weight: '400'
});

export const metadata: Metadata = {
  title: {
    default: "Ramon's 50th Celebration!",
    template: "%s | Ramon's 50th",
  },
  description: "Join us in celebrating Ramon's 50th Birthday! Share messages, photos, and memories in this special digital scrapbook. Bongga Kaayo!",
  openGraph: {
    title: "Ramon's 50th Celebration!",
    description: "A special digital scrapbook for Ramon's 50th. Join the party!",
    images: [
      {
        url: `https://placehold.co/1200x630.png?text=Ramon%27s+BIG+50th%21`, 
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontSerif.variable,
        fontDisplay.variable
      )}>
        <div className="relative min-h-screen flex flex-col">
          <main className="flex-grow flex flex-col">
            {/* Catch runtime errors in any page/component */}
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
