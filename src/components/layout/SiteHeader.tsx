
'use client';

import Link from 'next/link';
import { PartyPopper } from 'lucide-react';
import { AdminIcon } from '@/components/auth/AdminIcon';

interface SiteHeaderProps {
  isAdmin?: boolean;
}

export function SiteHeader({ isAdmin = false }: SiteHeaderProps) {
  return (
    <header className="w-full">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-8">
        <Link href="/login" className="flex items-center space-x-2 group">
          <PartyPopper className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-transform group-hover:scale-110" />
          <span className="font-headline text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">Ramon's 50th Jubilee!</span>
        </Link>
        <AdminIcon isAuthenticated={isAdmin} key={isAdmin ? 'admin-logged-in' : 'admin-logged-out'} />
      </div>
    </header>
  );
}
