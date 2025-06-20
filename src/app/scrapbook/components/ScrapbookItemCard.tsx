'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { AdminItemActions } from './AdminItemActions';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { MediaModal } from './MediaModal';
import type { ScrapbookItemData } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ScrapbookItemCardProps {
  item: ScrapbookItemData;
  isAdmin?: boolean;
  isPriority?: boolean;
}

export function ScrapbookItemCard({ item, isAdmin, isPriority = false }: ScrapbookItemCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTruncated, setIsTruncated] = useState(true);
    const isLongMessage = item.type === 'message' && item.content.length > 250;

    const toggleTruncate = () => {
        setIsTruncated(!isTruncated);
    };

    const formattedDate = item.timestamp
        ? new Date(item.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
        })
        : null; // Handle case where timestamp might be missing

    const cardStyles = cn(
        "flex flex-col h-full", // Ensure flex column and full height for consistent layout
        // Conditional size based on content type
        'w-full', // Maintain consistent width
        {
            // Existing styles
            'border-primary/40 bg-gradient-to-br from-primary/10 via-background to-background': item.accentColor === 'accent1' && !item.pinned,
            'border-secondary/40 bg-gradient-to-br from-secondary/10 via-background to-background': item.accentColor === 'accent2' && !item.pinned,
            'border-yellow-400/50 bg-gradient-to-br from-yellow-400/10 via-background to-background ring-2 ring-yellow-400/20 shadow-lg': item.pinned,
        }
    );

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Card className={cardStyles}>
            <CardHeader className="relative">
                 {isAdmin && (
                    <div className="absolute top-2 right-2">
                        <AdminItemActions item={item} />
                    </div>
                )}
                {item.pinned && (
                     <Badge
                        variant="default"
                        className="absolute top-2 left-2 bg-primary/10 text-primary shadow-sm font-sans text-xs font-medium border border-primary/20"
                     >
                        Pinned
                     </Badge>
                )}
                <CardTitle className="font-display text-lg md:text-xl font-bold pt-6">
                    {item.title}
                </CardTitle>
                <CardDescription className="font-sans text-sm md:text-base text-muted-foreground">
                    By {item.contributor}{formattedDate ? ` • ${formattedDate}` : ''}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {item.type === 'photo' && (
                    <div className="aspect-video relative rounded-md overflow-hidden my-4 cursor-pointer" onClick={openModal}>
                         <Image
                             src={item.content}
                             alt={item.description || item.title || 'Scrapbook photo'}
                             fill
                             className="object-cover"
                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                             priority={isPriority} // Prioritize loading for the first image
                         />
                    </div>
                )}
                <p
                    className={`font-serif text-sm md:text-base leading-relaxed text-foreground/80 ${
                        isLongMessage && isTruncated ? 'line-clamp-6' : ''
                    }`}
                >
                    {item.type === 'message' ? item.content : item.description}


                </p>
                {isLongMessage && (
                    <button
                        onClick={toggleTruncate}
                        className="font-sans text-sm font-medium text-primary hover:underline mt-2"
                    >
                        {isTruncated ? 'Read More' : 'Show Less'}
                    </button>
                )}
            </CardContent>
            {item.type === 'video' && (
                 <CardFooter className="cursor-pointer" onClick={openModal}>
                    <Badge variant="secondary" className="mt-auto font-sans text-xs font-medium">
                        Video
                    </Badge>
                </CardFooter>
            )}

            <MediaModal
                isOpen={isModalOpen}
                onClose={closeModal}
                mediaUrl={item.content}
                mediaType={item.type === 'photo' ? 'photo' : item.type === 'video' ? 'video' : null}
            />

        </Card>
    );
}
