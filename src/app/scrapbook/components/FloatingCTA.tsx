
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LeaveMessageDialog } from './LeaveMessageDialog';
import { PenSquare } from 'lucide-react';

export function FloatingCTA() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex justify-center items-center"
        >
          <PenSquare className="w-12 h-12" />
        </Button>
      </div>
      <LeaveMessageDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
