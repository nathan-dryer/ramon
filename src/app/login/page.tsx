
import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';
import { isPasswordEnabled } from '@/lib/password-state';
import { AdminIcon } from '@/components/auth/AdminIcon';
import { PartyPopper } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth'; 
import { LoginClientContent } from './LoginClientContent';

export const metadata: Metadata = {
  title: "Ramon's Wicked 50th Celebration! Login to Celebrate",
  description: "Join Ramon's 50th Birthday Celebration! Log in to access the digital scrapbook, share memories, and join the party. Bongga Kaayo!",
  openGraph: {
    title: "Ramon's Wicked 50th Celebration! Login to Celebrate",
    description: "It's time for Ramon's Golden Jubilee! Access the exclusive digital scrapbook, share your wishes, and be part of this milestone celebration.",
    images: [
      {
        url: `https://placehold.co/1200x630.png?text=Ramon%27s+50th+Jubilee%21`,
        width: 1200,
        height: 630,
        alt: "Ramon's 50th Jubilee Celebration Login Page",
        'data-ai-hint': 'party invitation festive',
      },
    ],
    type: 'website',
    siteName: "Ramon's 50th Celebration!",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ramon's Wicked 50th Celebration! Login",
    description: "Join the celebration for Ramon's 50th! Log in to share your messages and photos.",
    images: ['https://placehold.co/1200x630.png?text=Ramon%27s+50th+Jubilee%21'], 
  },
};


export default async function LoginPage() {
  const passwordEnabled = await isPasswordEnabled();
  const isAdmin = await isAdminAuthenticated(); 

  return (
    <main className="min-h-screen text-foreground">
      <AdminIcon isAuthenticated={isAdmin} key={isAdmin ? 'admin-logged-in' : 'admin-logged-out'} />
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 pt-16 md:pt-20"
      >
        <div className="text-center mb-4 md:mb-6">
          <h1 className="font-display text-6xl md:text-8xl font-bold text-foreground">
            Ramon's Wicked 50th Celebration!
          </h1>
          <p className="flex items-center justify-center font-serif text-2xl md:text-3xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            <span className="transition-all hover:text-foreground hover:tracking-wide">
              Bongga Kaayo! Let's Celebrate!
            </span>
            <PartyPopper className="h-10 w-10 ml-3 text-primary" aria-hidden="true" />
          </p>
        </div>

        <div className="w-full max-w-sm">
          <LoginForm passwordEnabled={passwordEnabled} />
        </div>
        
        <LoginClientContent isAdmin={isAdmin} />

      </div>
    </main>
  );
}
