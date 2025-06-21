
'use client';

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full max-w-xs mx-auto text-lg font-bold shadow-lg transition-all transform-gpu hover:shadow-xl hover:scale-105"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <span>Join Party</span>
      )}
    </Button>
  );
}

export function LoginForm({ passwordEnabled: _ }: { passwordEnabled: boolean }) { // passwordEnabled is no longer used
  const [state, formAction] = useActionState(login, { error: null });
  const { toast } = useToast();
  const router = useRouter();
  const [secretClickCount, setSecretClickCount] = useState(0);

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleSecretClick = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount >= 5) {
      router.push('/admin');
    }
  };

  return (
    <div className="w-full max-w-md text-center">
      <div 
        className="inline-flex items-center justify-center mb-4 cursor-pointer"
        onClick={handleSecretClick}
        title="Admin Access"
      >
      </div>

      <form action={formAction} className="space-y-6 mt-4">
        {/* Password input is removed as passwordEnabled is always false now */}
        {/* {passwordEnabled ? ( ... ) : null} */}
        <SubmitButton />
      </form>
    </div>
  );
}
