import { LoginForm } from './LoginForm';
import { PartyPopper } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pattern-bg">
      <div className="text-center mb-12">
        <PartyPopper className="mx-auto h-20 w-20 text-gold-DEFAULT mb-4" />
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary mb-2">
          Ramon's 50th Celebration!
        </h1>
        <p className="font-body text-xl text-muted-foreground">
          An exclusive digital scrapbook experience.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
