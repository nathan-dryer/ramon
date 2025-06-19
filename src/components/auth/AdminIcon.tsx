
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCog } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AdminLoginForm } from '@/app/admin/AdminLoginForm';

export function AdminIcon() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    setIsDialogOpen(false);
    router.refresh(); // Re-fetches server components, updates UI based on new admin cookie
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button 
          className="absolute top-4 right-4 text-primary hover:text-primary/80 transition-colors"
          aria-label="Admin Login"
          onClick={() => setIsDialogOpen(true)}
        >
          <UserCog className="h-7 w-7 sm:h-8 sm:w-8" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>
            Enter the admin password to access administrative features.
          </DialogDescription>
        </DialogHeader>
        <AdminLoginForm onSuccess={handleLoginSuccess} />
      </DialogContent>
    </Dialog>
  );
}
