
'use client';

import { useState, useEffect } from 'react';
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
import { logoutAdmin } from '@/app/admin/actions'; // Import server action

interface AdminIconProps {
  isAuthenticated: boolean;
}

export function AdminIcon({ isAuthenticated: initialIsAuthenticated }: AdminIconProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(initialIsAuthenticated);
  }, [initialIsAuthenticated]);

  const handleLoginSuccess = () => {
    setIsDialogOpen(false);
    router.refresh();
  };

  // Client-side handleLogout function is removed as the form will directly use the server action.

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className={`absolute top-4 right-4 transition-colors ${isAuthenticated ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground/80'}`}
          aria-label={isAuthenticated ? "Admin Settings" : "Admin Login"}
          onClick={() => setIsDialogOpen(true)} // Ensure dialog opens on click
        >
          {isAuthenticated ? <UserCheck className="h-7 w-7 sm:h-8 sm:w-8" /> : <UserCog className="h-7 w-7 sm:h-8 sm:w-8" />}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isAuthenticated ? 'Admin Controls' : 'Admin Login'}</DialogTitle>
          <DialogDescription>
            {isAuthenticated ? 'You are currently logged in as an administrator.' : 'Enter the admin password to access administrative features.'}
          </DialogDescription>
        </DialogHeader>
        {isAuthenticated ? (
          <div className="py-4">
            {/* Form now directly uses the logoutAdmin server action */}
            <form action={logoutAdmin} className="w-full">
              <Button type="submit" variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout Admin
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
