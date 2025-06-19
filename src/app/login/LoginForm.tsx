
'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom'; // Added this import
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
    <Button type="submit" className="w-full bg-accent1-DEFAULT hover:bg-accent1-DEFAULT/90 text-accent1-foreground button-neon-glow" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      <span>Enter Celebration</span>
    </Button>
  );
}

export function LoginForm() {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // formData is not used, so directly pass password for simplicity in this client-side handler.
    // For server actions, you'd typically pass formData or use useFormState.
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
    <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-sm border-border neon-glow-accent2">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-foreground">Welcome!</CardTitle>
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
              className="bg-input/50 border-border focus:ring-accent2-DEFAULT text-foreground"
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
