
'use client';

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { LeaveMessageDialog } from './LeaveMessageDialog';
import { AnimatePresence, motion } from 'framer-motion';

interface FloatingCTAProps {
  initialOpen?: boolean;
}

export function FloatingCTA({ initialOpen = false }: FloatingCTAProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isFabVisible, setIsFabVisible] = useState(true);

  // If the dialog is opened via a URL param, sync its state
  useEffect(() => {
    setIsOpen(initialOpen);
  }, [initialOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // When the dialog closes, make sure the FAB is visible again
    if (!open) {
      setIsFabVisible(true);
    }
  };

  const handleFabClick = () => {
    setIsOpen(true);
    setIsFabVisible(false);
  };


  return (
    <>
      {/* Floating action button – mobile-first pinned bottom-right */}
      <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50">
        <AnimatePresence>
            {isFabVisible && (
                 <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                 >
                    <Button
                        onClick={handleFabClick}
                        aria-label="Open post dialog"
                        size="icon"
                        className="rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:bg-primary/90 hover:shadow-xl hover:scale-110"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <LeaveMessageDialog open={isOpen} onOpenChange={handleOpenChange} />
    </>
  );
}
