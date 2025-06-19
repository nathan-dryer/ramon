
import { LoginForm } from './LoginForm';
import { isPasswordEnabled } from '@/lib/password-state';
import { AdminIcon } from '@/components/auth/AdminIcon';

export default async function LoginPage() {
  const passwordEnabled = await isPasswordEnabled();

  return (
    <main className="min-h-screen text-slate-800">
      <AdminIcon />
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
        // Removed inline backgroundImage style to inherit global background
      >
        <div className="text-center mb-4 md:mb-6">
          <h1 className="font-headline text-6xl md:text-8xl font-bold text-slate-900">
            Ramon's 50th Jubilee
          </h1>
          <p className="font-body text-2xl md:text-3xl text-slate-600 mt-4 max-w-2xl mx-auto">
            <span className="transition-all hover:text-slate-900 hover:tracking-wide">
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
