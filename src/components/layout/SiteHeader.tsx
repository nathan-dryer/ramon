import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { PartyPopper } from 'lucide-react';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from '@/lib/authConstants';

export function SiteHeader() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-8">
        <Link href={isAuthenticated ? "/scrapbook" : "/login"} className="flex items-center space-x-2 group">
          <PartyPopper className="h-8 w-8 text-accent1-DEFAULT group-hover:animate-pulse" />
          <span className="font-headline text-2xl font-bold text-foreground group-hover:text-accent1-DEFAULT transition-colors">Ramon's 50th!</span>
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated && (
            <>
              <Link
                href="/scrapbook"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent1-DEFAULT px-2 py-1 rounded-md hover:bg-accent1/10"
              >
                Scrapbook
              </Link>
              <Link
                href="/admin/videos"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent2-DEFAULT px-2 py-1 rounded-md hover:bg-accent2/10 hidden sm:inline-block"
              >
                Admin
              </Link>
              <LogoutButton />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
