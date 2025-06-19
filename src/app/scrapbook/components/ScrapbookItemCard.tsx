'use client';

import type { ScrapbookItemData } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { MessageSquare, Camera, Video, UserCircle, CalendarDays } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ScrapbookItemCardProps {
  item: ScrapbookItemData;
}

export function ScrapbookItemCard({ item }: ScrapbookItemCardProps) {
  const getIcon = () => {
    switch (item.type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-accent" />;
      case 'photo':
        return <Camera className="h-5 w-5 text-muted-foreground group-hover:text-accent" />;
      case 'video':
        return <Video className="h-5 w-5 text-muted-foreground group-hover:text-accent" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case 'message':
        return <p className="font-body text-foreground leading-relaxed whitespace-pre-wrap">{item.content}</p>;
      case 'photo':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative aspect-video w-full overflow-hidden rounded-md cursor-pointer group">
                <Image 
                  src={item.content} 
                  alt={item.title || 'Scrapbook photo'} 
                  fill 
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint="celebration party" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0">
               <Image src={item.content} alt={item.title || 'Scrapbook photo'} width={1200} height={800} className="rounded-lg object-contain max-h-[80vh]" data-ai-hint="friends family" />
            </DialogContent>
          </Dialog>
        );
      case 'video':
        // Basic embed for YouTube, Vimeo, or direct MP4. Assumes item.content is embeddable URL or iframe code.
        // More robust solution would parse URL and generate appropriate embed.
        // For direct video URLs:
        if (item.content.match(/\.(jpeg|jpg|gif|png)$/) != null || !item.content.startsWith('http')) { // crude check for non-video URLs or iframe code
           return <div dangerouslySetInnerHTML={{ __html: item.content }} className="aspect-video" />;
        } else if (item.content.includes("youtube.com/embed") || item.content.includes("player.vimeo.com/video")) {
           return <iframe src={item.content} className="aspect-video w-full rounded-md" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={item.title || 'Scrapbook video'}></iframe>;
        } else if (item.content.match(/\.mp4$/) !=null ) {
            return <video src={item.content} controls className="aspect-video w-full rounded-md" title={item.title || 'Scrapbook video'} />;
        }
        return <p className="font-body text-destructive">Unsupported video format or URL.</p>;
      default:
        return null;
    }
  };
  
  const cardHoverEffect = item.accentColor === 'magenta' ? 'neon-glow-magenta' : 'neon-glow-gold';

  return (
    <Card className={cn("h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1", cardHoverEffect)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          {getIcon()}
          {item.timestamp && (
            <div className="flex items-center text-xs text-muted-foreground font-body">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
              {new Date(item.timestamp).toLocaleDateString()}
            </div>
          )}
        </div>
        {item.title && <CardTitle className="font-headline text-xl leading-tight text-primary">{item.title}</CardTitle>}
      </CardHeader>
      <CardContent className="flex-grow">
        {renderContent()}
      </CardContent>
      {item.contributor && (
        <CardFooter className="pt-3">
          <div className="flex items-center text-sm text-muted-foreground font-body">
            <UserCircle className="mr-2 h-4 w-4" />
            From: <span className="font-medium text-foreground ml-1">{item.contributor}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
