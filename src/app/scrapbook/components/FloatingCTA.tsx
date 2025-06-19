
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LeaveMessageDialog } from './LeaveMessageDialog';
import { PenSquare } from 'lucide-react';

interface FloatingCTAProps {
  initialOpen?: boolean;
}

export function FloatingCTA({ initialOpen = false }: FloatingCTAProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(initialOpen);

  useEffect(() => {
    // Sync with initialOpen prop if it changes after mount (e.g. due to URL param)
    setIsDialogOpen(initialOpen);
  }, [initialOpen]);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex justify-center items-center bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Leave a message for Ramon"
        >
          <PenSquare className="w-8 h-8" />
        </Button>
      </div>
      <LeaveMessageDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
