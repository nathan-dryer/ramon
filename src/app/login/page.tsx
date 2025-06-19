
import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';
import { isPasswordEnabled } from '@/lib/password-state';
import { AdminIcon } from '@/components/auth/AdminIcon';
import { PartyPopper, Video } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth'; 
import { PasswordSettingsForm } from './PasswordSettingsForm'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Ramon's 50th Jubilee! Login to Celebrate",
  description: "Join Ramon's 50th Birthday Celebration! Log in to access the digital scrapbook, share memories, and join the party. Bongga Kaayo!",
  openGraph: {
    title: "Ramon's 50th Jubilee! Login to Celebrate",
    description: "It's time for Ramon's Golden Jubilee! Access the exclusive digital scrapbook, share your wishes, and be part of this milestone celebration.",
    url: '/', // Assuming login page is the root or adjust as needed. Base URL will be prepended.
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=Ramon%27s+50th+Jubilee%21', // Replace with an actual engaging image
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
    title: "Ramon's 50th Jubilee! Login",
    description: "Join the celebration for Ramon's 50th! Log in to share your messages and photos.",
    images: ['https://placehold.co/1200x630.png?text=Ramon%27s+50th+Jubilee%21'], // Replace with an actual engaging image
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
          <div className="flex justify-center mb-4">
            <PartyPopper className="h-16 w-16 text-primary" aria-hidden="true" />
          </div>
          <h1 className="font-headline text-6xl md:text-8xl font-bold text-foreground">
            Ramon's 50th Jubilee
          </h1>
          <p className="font-body text-2xl md:text-3xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            <span className="transition-all hover:text-foreground hover:tracking-wide">
              Bongga Kaayo! Let's Celebrate!
            </span>
          </p>
        </div>

        <div className="w-full max-w-sm">
          <LoginForm passwordEnabled={passwordEnabled} />
        </div>

        {isAdmin && (
          <div className="mt-12 w-full max-w-md flex flex-col items-center space-y-4">
            <PasswordSettingsForm isEnabled={passwordEnabled} />
            <Link href="/admin/videos" passHref>
              <Button variant="secondary" size="lg" className="font-body">
                <Video className="mr-2 h-5 w-5" /> Manage Admin Videos
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
