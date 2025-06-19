
'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { useFormState, useFormStatus } from 'react-dom';
import { login } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      <span>Enter Celebration</span>
    </Button>
  );
}


export function LoginForm() {
  // Using useFormState for server action handling
  const [state, formAction] = useFormState(login, { error: null });
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: state.error,
      });
    }
    // Successful login redirects, so no success toast needed here
  }, [state, toast]);

  return (
    <Card className="w-full max-w-sm shadow-xl bg-card backdrop-blur-sm border">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-foreground">Welcome!</CardTitle>
        <CardDescription className="font-body text-muted-foreground pt-1">
          Please enter the password to join.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-body text-foreground">Password</Label>
            <Input
              id="password"
              name="password" // Name attribute is crucial for server actions
              type="password"
              required
              className="bg-input border-border focus:ring-primary text-foreground"
              aria-describedby="password-hint"
            />
            <p id="password-hint" className="text-xs text-muted-foreground font-body">
              Hint: It's a special milestone! (Case-sensitive)
            </p>
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
