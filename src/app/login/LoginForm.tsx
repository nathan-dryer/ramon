'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { login } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Enter Celebration
    </Button>
  );
}

export function LoginForm() {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await login(password);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.error,
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary">Welcome!</CardTitle>
        <CardDescription className="font-body text-muted-foreground">
          Please enter the password to join Ramon's 50th Celebration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-body text-foreground">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/70 border-border focus:ring-accent"
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
