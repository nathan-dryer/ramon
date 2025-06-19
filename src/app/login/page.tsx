
import { LoginForm } from './LoginForm';
import { isPasswordEnabled } from '@/lib/password-state';
import { AdminIcon } from '@/components/auth/AdminIcon';
import { PartyPopper } from 'lucide-react';

export default async function LoginPage() {
  const passwordEnabled = await isPasswordEnabled();

  return (
    <main className="min-h-screen text-foreground">
      <AdminIcon />
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
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
      </div>
    </main>
  );
}
