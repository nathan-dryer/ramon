
import { SiteHeader } from '@/components/layout/SiteHeader';
import { VideoAdminForm } from './VideoAdminForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAdminVideos } from './actions';
import type { ScrapbookItemData } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Video, ListVideo, Pin as PinIcon, PlayCircle } from 'lucide-react';
import { PinToggleButton } from './PinToggleButton';
import { isAdminAuthenticated } from '@/lib/adminAuth';

async function SubmittedVideosList() {
  const videos = await getAdminVideos();

  if (videos.length === 0) {
    return <p className="font-body text-muted-foreground text-center py-4">No videos submitted yet via admin panel.</p>;
  }

  return (
    <ScrollArea className="h-[400px] mt-6 rounded-md border p-4 bg-background/30">
      <h3 className="font-headline text-lg mb-4 text-primary">Submitted Videos ({videos.length})</h3>
      <ul className="space-y-3">
        {videos.map((video: ScrapbookItemData) => (
          <li key={video.id} className="p-3 bg-card rounded-md shadow-sm border flex justify-between items-center group">
            <div>
              <div className="flex items-center mb-1">
                <Video className="h-4 w-4 mr-2 text-primary"/>
                <p className="font-body font-medium text-foreground truncate">{video.title}</p>
                {video.pinned && <PinIcon className="h-4 w-4 ml-2 text-primary" aria-label="Pinned" />}
                {video.autoplay && <PlayCircle className="h-4 w-4 ml-2 text-blue-500" aria-label="Autoplay enabled" title="Autoplay enabled" />}
              </div>
              <p className="font-body text-xs text-muted-foreground truncate " title={video.content}>URL/Embed: {video.content}</p>
              {video.contributor && <p className="font-body text-xs text-muted-foreground mt-0.5">By: {video.contributor}</p>}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <PinToggleButton videoId={video.id} isPinned={!!video.pinned} />
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}


export default async function AdminVideosPage() {
  const isAdmin = await isAdminAuthenticated();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader isAdmin={isAdmin} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-3">
            Admin Video Management
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Add pre-recorded video messages and manage pinned videos for Ramon's scrapbook.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg bg-card backdrop-blur-sm border-primary/50">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Add New Video</CardTitle>
              <CardDescription className="font-body text-muted-foreground">
                Enter the details for the video message. These will be shown in the scrapbook.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoAdminForm />
            </CardContent>
          </Card>

          <Separator className="my-12" />
          
          <Card className="shadow-lg bg-card backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center text-foreground">
                <ListVideo className="mr-3 h-6 w-6 text-primary" /> Current Admin Videos
              </CardTitle>
              <CardDescription className="font-body text-muted-foreground">
                List of videos added through this panel. Pin videos to feature them at the top of the scrapbook.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <SubmittedVideosList />
            </CardContent>
          </Card>

        </div>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground font-body border-t">
        Admin Panel - Ramon's 50th Celebration
      </footer>
    </div>
  );
}
