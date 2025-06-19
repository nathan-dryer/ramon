'use client';

import type { ScrapbookItemData } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { MessageSquare, Camera, Video, UserCircle, CalendarDays, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ScrapbookItemCardProps {
  item: ScrapbookItemData;
}

export function ScrapbookItemCard({ item }: ScrapbookItemCardProps) {
  const getIcon = () => {
    const iconColor = item.accentColor === 'accent1' ? 'text-accent1-DEFAULT' : 'text-accent2-DEFAULT';
    switch (item.type) {
      case 'message':
        return <MessageSquare className={`h-6 w-6 ${iconColor} group-hover:animate-pulse`} />;
      case 'photo':
        return <Camera className={`h-6 w-6 ${iconColor} group-hover:animate-pulse`} />;
      case 'video':
        return <Video className={`h-6 w-6 ${iconColor} group-hover:animate-pulse`} />;
      default:
        return <Zap className={`h-6 w-6 ${iconColor} group-hover:animate-pulse`} />;
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case 'message':
        return <p className="font-body text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{item.content}</p>;
      case 'photo':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative aspect-video w-full overflow-hidden rounded-md cursor-pointer group border border-border hover:border-primary transition-all">
                <Image 
                  src={item.content} 
                  alt={item.title || 'Scrapbook photo'} 
                  fill 
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint="party fun" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <Camera className="h-12 w-12 text-white/70 transform scale-150 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 bg-card/80 backdrop-blur-md border-primary neon-glow-accent2">
               <Image src={item.content} alt={item.title || 'Scrapbook photo'} width={1200} height={800} className="rounded-lg object-contain max-h-[80vh]" data-ai-hint="celebration moment" />
            </DialogContent>
          </Dialog>
        );
      case 'video':
        const commonVideoClasses = "aspect-video w-full rounded-md border border-border";
        if (item.content.startsWith('<iframe')) {
          return <div dangerouslySetInnerHTML={{ __html: item.content }} className={commonVideoClasses} />;
        } else if (item.content.includes("youtube.com/embed") || item.content.includes("player.vimeo.com/video")) {
           return <iframe src={item.content} className={commonVideoClasses} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={item.title || 'Scrapbook video'}></iframe>;
        } else if (item.content.match(/\.(mp4|webm|ogg)$/) !=null ) { // More robust video extension check
            return <video src={item.content} controls className={commonVideoClasses} title={item.title || 'Scrapbook video'} />;
        }
        return <p className="font-body text-destructive">Unsupported video format: <span className="text-xs">{item.content.substring(0,100)}...</span></p>;
      default:
        return null;
    }
  };
  
  const cardHoverEffect = item.accentColor === 'accent1' ? 'neon-glow-accent1' : 'neon-glow-accent2';
  const cardBorderColor = item.accentColor === 'accent1' ? 'border-accent1-DEFAULT/30' : 'border-accent2-DEFAULT/30';

  return (
    <Card className={cn(
        "h-full flex flex-col overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm group",
        cardHoverEffect,
        cardBorderColor
      )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          {getIcon()}
          {item.timestamp && (
            <div className="flex items-center text-xs text-muted-foreground font-body">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
              {new Date(item.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
        {item.title && <CardTitle className={cn("font-headline text-xl md:text-2xl leading-tight", item.accentColor === 'accent1' ? 'text-accent1-DEFAULT text-shadow-accent1' : 'text-accent2-DEFAULT text-shadow-accent2')}>{item.title}</CardTitle>}
         {item.type === 'message' && !item.title && <CardTitle className="font-headline text-xl text-muted-foreground italic">A heartfelt message...</CardTitle>}
      </CardHeader>
      <CardContent className="flex-grow min-h-[100px]">
        {renderContent()}
      </CardContent>
      {item.contributor && (
        <CardFooter className="pt-4 mt-auto border-t border-border/50">
          <div className="flex items-center text-sm text-muted-foreground font-body">
            <UserCircle className="mr-2 h-4 w-4" />
            From: <span className="font-medium text-foreground/80 ml-1">{item.contributor}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
