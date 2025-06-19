
import { LoginForm } from './LoginForm';
import { isPasswordEnabled } from '@/lib/password-state';
import { AdminIcon } from '@/components/auth/AdminIcon';
import { PartyPopper } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth'; // Import admin auth check
import { PasswordSettingsForm } from './PasswordSettingsForm'; // Import the new form
import { SiteHeader } from '@/components/layout/SiteHeader'; // For consistent header if needed on login
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Video } from 'lucide-react';

export default async function LoginPage() {
  const passwordEnabled = await isPasswordEnabled();
  const isAdmin = await isAdminAuthenticated(); // Check if admin is logged in

  return (
    <main className="min-h-screen text-foreground">
      <AdminIcon />
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 pt-16 md:pt-20" // Added padding top
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
