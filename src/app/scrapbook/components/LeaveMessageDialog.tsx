'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { LeaveMessageForm } from './LeaveMessageForm';
import { MessageCirclePlus, X } from 'lucide-react';
import { useState } from 'react';

interface LeaveMessageDialogProps {
  className?: string;
}

export function LeaveMessageDialog({ className }: LeaveMessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSuccess = () => {
    setIsOpen(false); // Close dialog on successful submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="lg" 
          className={`bg-accent1-DEFAULT hover:bg-accent1-DEFAULT/80 text-accent1-foreground shadow-lg button-neon-glow ${className}`}
        >
          <MessageCirclePlus className="mr-2 h-6 w-6" />
          <span>Leave a Message / Roast / Toast!</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] xl:max-w-[40vw] bg-card/90 backdrop-blur-md border-accent1-DEFAULT neon-glow-accent1 p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl text-accent1-DEFAULT text-shadow-accent1">Share Your Thoughts for Ramon!</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Drop a birthday wish, a funny roast, or a heartfelt toast. Let's fill this scrapbook with awesome memories!
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-0 max-h-[70vh] overflow-y-auto">
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
