import { LoginForm } from './LoginForm';
import { PartyPopper, Disc3 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="absolute inset-0 -z-20 bg-background" />
      <div className="text-center mb-12 relative">
        <Disc3 className="absolute -top-16 -left-24 h-48 w-48 text-accent2-DEFAULT/30 animate-pulse opacity-30 transform rotate-[30deg]" />
        <PartyPopper className="mx-auto h-20 w-20 text-accent1-DEFAULT mb-4 text-shadow-accent1" />
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-foreground mb-2">
          Ramon's 50th Celebration!
        </h1>
        <p className="font-body text-xl text-muted-foreground">
          An exclusive digital scrapbook experience.
        </p>
         <Disc3 className="absolute -bottom-16 -right-24 h-40 w-40 text-accent1-DEFAULT/30 animate-pulse opacity-30 transform rotate-[-45deg]" />
      </div>
      <LoginForm />
    </div>
  );
}
