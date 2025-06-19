
'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminLogin } from './actions'; // Added import

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      <span>Login</span>
    </Button>
  );
}

interface AdminLoginFormProps {
  onSuccess?: () => void;
}

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [state, formAction] = useActionState(adminLogin, { error: null, success: false });
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: state.error,
      });
    }

    if(state?.success){
        if (onSuccess) {
          onSuccess();
        }
    }
  }, [state, toast, onSuccess]);

  return (
    <form action={formAction} className="space-y-6">
        <div className="space-y-2">
        <Label htmlFor="password" className="font-body text-foreground">Password</Label>
        <Input
            id="password"
            name="password"
            type="password"
            required
            className="bg-input border-border focus:ring-primary text-foreground"
        />
        </div>
        <SubmitButton />
    </form>
  );
}
