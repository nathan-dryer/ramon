
'use client';

import type { ScrapbookItemData } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { MessageSquare, Camera, Video, UserCircle, CalendarDays, Zap, FileText, Pin } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ScrapbookItemCardProps {
  item: ScrapbookItemData;
}

export function ScrapbookItemCard({ item }: ScrapbookItemCardProps) {
  const iconColor = item.accentColor === 'accent1' ? 'text-accent1' : 'text-accent2';
  
  const getTypeIcon = () => {
    switch (item.type) {
      case 'message':
        return <MessageSquare className={cn('h-5 w-5 group-hover:animate-pulse', iconColor)} />;
      case 'photo':
        return <Camera className={cn('h-5 w-5 group-hover:animate-pulse', iconColor)} />;
      case 'video':
        return <Video className={cn('h-5 w-5 group-hover:animate-pulse', iconColor)} />;
      default:
        return <Zap className={cn('h-5 w-5 group-hover:animate-pulse', iconColor)} />;
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case 'message':
        return <p className="font-body text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{item.content}</p>;
      case 'photo':
        return (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative aspect-video w-full overflow-hidden rounded-md cursor-pointer group/photo border hover:border-primary/70 transition-all">
                  <Image
                    src={item.content}
                    alt={item.title || 'Scrapbook photo'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/photo:scale-105"
                    data-ai-hint={item.dataAiHint || "party celebration"} />
                  <div className="absolute inset-0 bg-black/30 group-hover/photo:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover/photo:opacity-100">
                     <Camera className="h-12 w-12 text-white/70 transform scale-150 group-hover/photo:scale-100 transition-transform duration-300" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0 bg-card/95 backdrop-blur-sm border-primary/50 rounded-lg">
                 <Image src={item.content} alt={item.title || 'Scrapbook photo'} width={1200} height={800} className="rounded-lg object-contain max-h-[80vh]" data-ai-hint={item.dataAiHint || "party celebration detail"} />
              </DialogContent>
            </Dialog>
            {item.description && (
              <div className="mt-3 p-3 bg-background/50 rounded-md border">
                <div className="flex items-start text-sm text-muted-foreground mb-1">
                  <FileText className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-primary"/> 
                  <span className="font-medium text-foreground">Caption:</span>
                </div>
                <p className="font-body text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm pl-6">
                  {item.description}
                </p>
              </div>
            )}
          </>
        );
      case 'video':
        const commonVideoClasses = "aspect-video w-full rounded-md border";
        if (item.content.startsWith('<iframe')) {
          return <div dangerouslySetInnerHTML={{ __html: item.content }} className={cn(commonVideoClasses, "overflow-hidden")} />;
        } else if (item.content.includes("youtube.com/embed") || item.content.includes("player.vimeo.com/video")) {
           return <iframe src={item.content} className={commonVideoClasses} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={item.title || 'Scrapbook video'}></iframe>;
        } else if (item.content.match(/\.(mp4|webm|ogg)$/) !=null ) { 
            return <video src={item.content} controls className={commonVideoClasses} title={item.title || 'Scrapbook video'} />;
        }
        return <p className="font-body text-destructive">Unsupported video format: <span className="text-xs">{item.content.substring(0,100)}...</span></p>;
      default:
        return null;
    }
  };
  
  const cardAccentColor = item.accentColor === 'accent1' ? 'border-accent1/60' : 'border-accent2/60';

  return (
    <Card className={cn(
        "h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card backdrop-blur-sm group",
        "hover:scale-[1.02] hover:border-primary/50", // Subtle lift and scale
        cardAccentColor // Keep accent border
      )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            {item.pinned && <Pin className="h-5 w-5 text-primary" aria-label="Pinned item" />}
          </div>
          {item.timestamp && (
            <div className="flex items-center text-xs text-muted-foreground font-body">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
              {new Date(item.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
            </div>
          )}
        </div>
        {item.title && <CardTitle className={cn("font-headline text-xl md:text-2d leading-tight", item.accentColor === 'accent1' ? 'text-accent1' : 'text-accent2')}>{item.title}</CardTitle>}
        {(item.type === 'message' || (item.type === 'photo' && !item.description)) && !item.title && <CardTitle className="font-headline text-xl text-muted-foreground italic">A heartfelt submission...</CardTitle>}
      </CardHeader>
      <CardContent className="flex-grow min-h-[100px]">
        {renderContent()}
      </CardContent>
      {item.contributor && (
        <CardFooter className="pt-4 mt-auto border-t">
          <div className="flex items-center text-sm text-muted-foreground font-body">
            <UserCircle className="mr-2 h-4 w-4" />
            From: <span className="font-medium text-foreground/80 ml-1">{item.contributor}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
