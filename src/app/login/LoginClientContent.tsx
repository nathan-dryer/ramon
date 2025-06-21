
'use client';

import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { isPasswordEnabled } from '@/lib/password-state'; // No longer needed
// import { useEffect, useState } from 'react'; // No longer needed

// PasswordSettingsForm is removed
// const PasswordSettingsForm = dynamic(() => import('./PasswordSettingsForm').then(mod => mod.PasswordSettingsForm), {
//   suspense: true,
//   ssr: false,
// });

interface LoginClientContentProps {
  isAdmin: boolean;
}

export function LoginClientContent({ isAdmin }: LoginClientContentProps) {
  // const [passwordEnabled, setPasswordEnabled] = useState<boolean | null>(null); // No longer needed

  // useEffect(() => { // No longer needed
  //   async function checkPassword() {
  //     const enabled = await isPasswordEnabled();
  //     setPasswordEnabled(enabled);
  //   }
  //   checkPassword();
  // }, []);

  if (!isAdmin) {
    return null;
  }
  
  // Loading state for passwordEnabled is no longer needed
  // if (passwordEnabled === null) {
  //     return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  // }

  return (
    <div className="mt-12 w-full max-w-md flex flex-col items-center space-y-4">
      {/* PasswordSettingsForm is removed, so Suspense and the component call are removed */}
      {/* <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <PasswordSettingsForm isEnabled={passwordEnabled} />
      </Suspense> */}
      <Link href="/admin/videos" passHref>
        <Button variant="secondary" size="lg" className="font-body">
          <Video className="mr-2 h-5 w-5" /> Manage Admin Videos
        </Button>
      </Link>
    </div>
  );
}
