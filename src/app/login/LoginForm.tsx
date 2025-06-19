
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
      className="w-full max-w-xs mx-auto bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-full" 
      disabled={pending}
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="font-bold">Let's Party!</span>}
    </Button>
  );
}

export function LoginForm({ passwordEnabled }: { passwordEnabled: boolean }) {
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
        {passwordEnabled ? (
          <div className="space-y-3 max-w-sm mx-auto">
            <p className="font-body text-muted-foreground mb-4">
              Please enter the password to join.
            </p>
            <Label htmlFor="password" className="sr-only">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter the secret password"
              className="bg-white/80 border-slate-300 focus:ring-violet-500 text-slate-800 text-center text-lg"
              aria-describedby="password-hint"
            />
            <p id="password-hint" className="text-xs text-slate-500 font-body pt-1">
              Hint: It's a special milestone!
            </p>
          </div>
        ) : null}
        <SubmitButton />
      </form>
    </div>
  );
}
