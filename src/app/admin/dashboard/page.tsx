
import { isPasswordEnabled } from '@/lib/password-state';
import { PasswordToggle } from './PasswordToggle';
import { Button } from '@/components/ui/button';
import { logoutAdmin } from '../actions';
import { AdminLoginForm } from '../AdminLoginForm';

export default async function AdminDashboard() {
  const passwordEnabled = await isPasswordEnabled();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-headline text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <form action={logoutAdmin}>
            <Button variant="outline">Logout</Button>
          </form>
        </div>
        <PasswordToggle isEnabled={passwordEnabled} />
      </div>
    </div>
  );
}
