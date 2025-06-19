'use client';

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="absolute top-4 right-4">
          <UserCog className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-transform group-hover:scale-110" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>
            Enter the admin password to access the settings page.
          </DialogDescription>
        </DialogHeader>
        <AdminLoginForm />
      </DialogContent>
    </Dialog>
  );
}
