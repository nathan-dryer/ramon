
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCog, UserCheck, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AdminLoginForm } from '@/app/admin/AdminLoginForm';
import { Button } from '@/components/ui/button';
import { logoutAdmin } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';

interface AdminIconProps {
  isAuthenticated: boolean;
}

interface LogoutState {
  error?: string | null;
  success?: boolean;
}

export function AdminIcon({ isAuthenticated: initialIsAuthenticated }: AdminIconProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // This local state is primarily to reflect the prop, updated by useEffect
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const router = useRouter();
  const { toast } = useToast();

  const [logoutState, logoutFormAction, isLogoutPending] = useActionState<LogoutState, FormData>(logoutAdmin, { success: false, error: null });

  useEffect(() => {
    setIsAuthenticated(initialIsAuthenticated);
  }, [initialIsAuthenticated]);

  const handleLoginSuccess = () => {
    setIsDialogOpen(false);
    router.refresh(); // This will re-fetch server props, including the new auth state
  };

  useEffect(() => {
    if (logoutState.success) {
      setIsDialogOpen(false);
      router.refresh(); // Refresh to ensure auth state is cleared server-side for other components
      router.push('/login'); // Navigate to login page
      toast({ title: "Admin Logout", description: "You have been successfully logged out." });
    }
    if (logoutState.error) {
      toast({ variant: "destructive", title: "Logout Error", description: logoutState.error });
    }
  }, [logoutState, router, toast]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className={`fixed top-4 right-4 transition-colors p-2 rounded-full hover:bg-muted/50 z-50 ${isAuthenticated ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground/80'}`}
          aria-label={isAuthenticated ? "Admin Settings" : "Admin Login"}
        >
          {isAuthenticated ? <UserCheck className="h-7 w-7 sm:h-8 sm:w-8" /> : <UserCog className="h-7 w-7 sm:h-8 sm:w-8" />}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{isAuthenticated ? 'Admin Controls' : 'Admin Login'}</DialogTitle>
          <DialogDescription className="font-body">
            {isAuthenticated ? 'You are currently logged in as an administrator.' : 'Enter the admin password to access administrative features.'}
          </DialogDescription>
        </DialogHeader>
        {isAuthenticated ? (
          <div className="py-4">
            <form action={logoutFormAction}>
              <Button type="submit" variant="outline" className="w-full font-body" disabled={isLogoutPending}>
                <LogOut className="mr-2 h-4 w-4" />
                {isLogoutPending ? 'Logging out...' : 'Logout Admin'}
              </Button>
            </form>
          </div>
        ) : (
          <AdminLoginForm onSuccess={handleLoginSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
}
