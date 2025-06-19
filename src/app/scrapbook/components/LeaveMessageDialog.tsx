
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { LeaveMessageForm } from './LeaveMessageForm';
import { X } from 'lucide-react';

interface LeaveMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeaveMessageDialog({ open, onOpenChange }: LeaveMessageDialogProps) {
  const handleFormSuccess = () => {
    onOpenChange(false); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] xl:max-w-[40vw] bg-card/95 backdrop-blur-md border-primary/50 p-0 rounded-lg">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="font-headline text-2xl text-primary">Post a Bday Message</DialogTitle>
          <DialogDescription className="text-muted-foreground font-body">
            Drop a birthday wish, a funny memory, or a cool photo. Let's fill this scrapbook! AI will help enhance your message.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-4 max-h-[70vh] overflow-y-auto">
          <LeaveMessageForm onSuccess={handleFormSuccess} />
        </div>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
