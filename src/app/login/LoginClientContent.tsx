
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { isPasswordEnabled } from '@/lib/password-state';
import { useEffect, useState } from 'react';

// Dynamically import the PasswordSettingsForm on the client
const PasswordSettingsForm = dynamic(() => import('./PasswordSettingsForm').then(mod => mod.PasswordSettingsForm), {
  suspense: true,
  ssr: false, // This is now safe in a Client Component
});

interface LoginClientContentProps {
  isAdmin: boolean;
}

export function LoginClientContent({ isAdmin }: LoginClientContentProps) {
  const [passwordEnabled, setPasswordEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkPassword() {
      const enabled = await isPasswordEnabled();
      setPasswordEnabled(enabled);
    }
    checkPassword();
  }, []);

  if (!isAdmin) {
    return null;
  }
  
  if (passwordEnabled === null) {
      return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="mt-12 w-full max-w-md flex flex-col items-center space-y-4">
      <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <PasswordSettingsForm isEnabled={passwordEnabled} />
      </Suspense>
      <Link href="/admin/videos" passHref>
        <Button variant="secondary" size="lg" className="font-body">
          <Video className="mr-2 h-5 w-5" /> Manage Admin Videos
        </Button>
      </Link>
    </div>
  );
}
