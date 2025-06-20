'use client';
import { DialogDescription } from '@radix-ui/react-dialog';
import React, { useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaType: 'photo' | 'video' | null;
}

export const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose, mediaUrl, mediaType }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!mediaUrl || !mediaType) {
    return null;
  }

  const dialogDescription = useMemo(() => {
    if (mediaType === 'photo') return 'Viewing an expanded photo.';
    if (mediaType === 'video') return 'Viewing a video.';
    return 'Viewing media content.';
  }, [mediaType]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <VisuallyHidden asChild>
        <DialogTitle>Media Viewer</DialogTitle>
      </VisuallyHidden>
      <DialogContent className="max-w-full max-h-full w-fit h-fit p-0 border-none bg-transparent">
        <div className="relative w-full h-full flex items-center justify-center">
          <VisuallyHidden asChild>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </VisuallyHidden>
          {mediaType === 'photo' && (
            <Image
              src={mediaUrl}
              alt="Expanded media"
              layout="intrinsic"
              width={1200} // Adjust as needed for max size
              height={800} // Adjust as needed for max size
              className="object-contain max-w-[95vw] max-h-[95vh] rounded-md"
            />
          )}
          {mediaType === 'video' && (
            <video controls className="max-w-[95vw] max-h-[95vh] rounded-md">
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};