
import { LoginForm } from './LoginForm';
import { PartyPopper } from 'lucide-react'; // Removed Disc3 as it might not fit the minimal style

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      {/* Removed absolute positioned Disc3 icons */}
      <div className="text-center mb-12 relative">
        <PartyPopper className="mx-auto h-16 w-16 md:h-20 md:w-20 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-2">
          Ramon's 50th Celebration!
        </h1>
        <p className="font-body text-lg sm:text-xl text-muted-foreground">
          An exclusive digital scrapbook experience.
        </p>
      </div>
      <LoginForm />
      <footer className="absolute bottom-0 py-6 text-center text-sm text-muted-foreground font-body">
        Enter the celebration.
      </footer>
    </div>
  );
}
