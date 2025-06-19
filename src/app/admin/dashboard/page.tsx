
import { isPasswordEnabled } from '@/lib/password-state';
import { PasswordToggle } from './PasswordToggle';
import { Button } from '@/components/ui/button';
import { logoutAdmin } from '../actions';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export default async function AdminDashboard() {
  const passwordEnabled = await isPasswordEnabled();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-headline text-4xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Link href="/scrapbook" passHref>
              <Button variant="outline" className="font-body">
                <Eye className="mr-2 h-4 w-4" />
                View Scrapbook
              </Button>
            </Link>
            <form action={logoutAdmin}>
              <Button variant="outline" className="font-body">Logout</Button>
            </form>
          </div>
        </div>
        <PasswordToggle isEnabled={passwordEnabled} />
        
        <div className="mt-12 text-center">
          <Link href="/admin/videos" passHref>
            <Button variant="secondary" size="lg" className="font-body">Manage Admin Videos</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

