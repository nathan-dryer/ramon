
'use client';

import { Button } from '@/components/ui/button';
import { MessageSquarePlus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
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
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
            {isFabVisible && (
                 <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                 >
                    <Button 
                        size="icon" // Use icon size for a round button
                        className="rounded-full shadow-lg w-14 h-14" // Set fixed width and height for perfect circle
                        onClick={handleFabClick}
                        aria-label="Leave a message"
                    >
                        <MessageSquarePlus className="h-6 w-6" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <LeaveMessageDialog open={isOpen} onOpenChange={handleOpenChange} />
    </>
  );
}
