import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AUTH_COOKIE_NAME } from '@/lib/authConstants';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  async function logoutAction() {
    'use server';
    cookies().delete(AUTH_COOKIE_NAME);
    redirect('/login');
  }

  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-accent1-DEFAULT hover:bg-accent1/10">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </form>
  );
}
