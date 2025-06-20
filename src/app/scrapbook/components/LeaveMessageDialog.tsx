
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LeaveMessageForm } from './LeaveMessageForm';
import { Button } from '@/components/ui/button'; // If needed for a trigger

interface LeaveMessageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LeaveMessageDialog({ open, onOpenChange }: LeaveMessageDialogProps) {

  const handleFormSuccess = () => {
    // Close the dialog upon successful submission
    onOpenChange(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]" aria-describedby="message-dialog-description">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Share Your Memory</DialogTitle>
          <DialogDescription id="message-dialog-description" className="font-body">
            Add your message, photo, or both to celebrate Ramon. Let's make this unforgettable!
 </DialogDescription>
        </DialogHeader>
        <LeaveMessageForm onFormSuccess={handleFormSuccess} />
      </DialogContent>
    </Dialog>
  );
}
