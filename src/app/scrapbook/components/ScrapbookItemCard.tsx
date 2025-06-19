
'use client';

import type { ScrapbookItemData } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { MessageSquare, Camera, Video, UserCircle, CalendarDays, Zap, FileText, Pin, Share2, Copy, Facebook } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { AdminItemActions } from './AdminItemActions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


interface ScrapbookItemCardProps {
  item: ScrapbookItemData;
  isAdmin?: boolean;
}

export function ScrapbookItemCard({ item, isAdmin }: ScrapbookItemCardProps) {
  const { toast } = useToast();
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

  const getItemTextContent = () => {
    let text = item.title || '';
    if (item.type === 'message' && item.content) {
      text += (text ? ' - ' : '') + item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '');
    } else if (item.type === 'photo' && item.description) {
      text += (text ? ' - ' : '') + item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '');
    }
    return text || "Check out this moment from Ramon's 50th Celebration!";
  }

  const handleShareFacebook = () => {
    const siteUrl = window.location.origin + '/scrapbook';
    const textToShare = getItemTextContent();
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(textToShare)}`;
    window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    const siteUrl = window.location.origin + '/scrapbook';
    navigator.clipboard.writeText(siteUrl)
      .then(() => {
        toast({ title: "Link Copied!", description: "Scrapbook link copied to clipboard." });
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy link." });
      });
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
        const allowString = `autoplay ${item.autoplay ? 'autoplay;' : ''} fullscreen; picture-in-picture;`;
        
        if (item.content.startsWith('<iframe')) {
          let modifiedIframe = item.content;
          if (item.autoplay) {
            if (modifiedIframe.includes('allow=')) {
              modifiedIframe = modifiedIframe.replace('allow="', `allow="autoplay; `);
            } else {
              modifiedIframe = modifiedIframe.replace('<iframe', `<iframe allow="autoplay"`);
            }
            if (modifiedIframe.includes('youtube.com/embed') && !modifiedIframe.includes('mute=1')) {
                modifiedIframe = modifiedIframe.replace('?feature=oembed', '?feature=oembed&autoplay=1&mute=1');
                 // Try to add enablejsapi=1 for YouTube if not present for autoplay control
                if (!modifiedIframe.includes('enablejsapi=1')) {
                    if (modifiedIframe.includes('?')) {
                        modifiedIframe = modifiedIframe.replace('?', '?enablejsapi=1&');
                    } else {
                        modifiedIframe = modifiedIframe.replace('embed/', 'embed/?enablejsapi=1');
                    }
                }
            }
          }
          return <div dangerouslySetInnerHTML={{ __html: modifiedIframe }} className={cn(commonVideoClasses, "overflow-hidden")} />;
        } else if (item.content.includes("youtube.com/embed") || item.content.includes("player.vimeo.com/video")) {
           let src = item.content;
           if (item.autoplay && src.includes('youtube.com/embed') && !src.includes('autoplay=1')) {
             src += (src.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&enablejsapi=1';
           } else if (item.autoplay && src.includes('player.vimeo.com/video') && !src.includes('autoplay=1')) {
             src += (src.includes('?') ? '&' : '?') + 'autoplay=1&muted=1';
           }
           return <iframe src={src} className={commonVideoClasses} allow={allowString} allowFullScreen title={item.title || 'Scrapbook video'}></iframe>;
        } else if (item.content.match(/\.(mp4|webm|ogg)$/) !=null ) { 
            return <video src={item.content} controls autoPlay={item.autoplay} muted={item.autoplay} className={commonVideoClasses} title={item.title || 'Scrapbook video'} />;
        }
        return <p className="font-body text-destructive">Unsupported video format: <span className="text-xs">{item.content.substring(0,100)}...</span></p>;
      default:
        return null;
    }
  };
  
  const cardAccentColor = item.accentColor === 'accent1' ? 'border-accent1/60' : 'border-accent2/60';

  return (
    <Card className={cn(
        "h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card backdrop-blur-sm group relative", 
        "hover:scale-[1.02] hover:border-primary/50", 
        cardAccentColor 
      )}>
      {isAdmin && <AdminItemActions item={item} />}
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
        {item.title && <CardTitle className={cn("font-headline text-xl md:text-2xl leading-tight", item.accentColor === 'accent1' ? 'text-accent1' : 'text-accent2')}>{item.title}</CardTitle>}
        {((item.type === 'message' && item.content) || (item.type === 'photo' && !item.description)) && !item.title && <CardTitle className="font-headline text-xl text-muted-foreground italic">A heartfelt submission...</CardTitle>}
      </CardHeader>
      <CardContent className="flex-grow min-h-[100px]">
        {renderContent()}
      </CardContent>
      <CardFooter className="pt-4 mt-auto border-t flex justify-between items-center">
        {item.contributor && (
          <div className="flex items-center text-sm text-muted-foreground font-body">
            <UserCircle className="mr-2 h-4 w-4" />
            From: <span className="font-medium text-foreground/80 ml-1">{item.contributor}</span>
          </div>
        )}
        <div className="ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 space-y-1">
              <Button variant="outline" size="sm" onClick={handleShareFacebook} className="w-full justify-start">
                <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" /> Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="w-full justify-start">
                <Copy className="h-4 w-4 mr-2" /> Copy Link
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </CardFooter>
    </Card>
  );
}
