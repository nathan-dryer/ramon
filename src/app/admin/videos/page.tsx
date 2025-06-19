import { SiteHeader } from '@/components/layout/SiteHeader';
import { VideoAdminForm } from './VideoAdminForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAdminVideos } from './actions';
import type { ScrapbookItemData } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Video, ListVideo } from 'lucide-react';

async function SubmittedVideosList() {
  const videos = await getAdminVideos();

  if (videos.length === 0) {
    return <p className="font-body text-muted-foreground text-center py-4">No videos submitted yet via admin panel.</p>;
  }

  return (
    <ScrollArea className="h-[400px] mt-6 rounded-md border border-border p-4 bg-background/50">
      <h3 className="font-headline text-lg mb-4 text-accent2-DEFAULT">Submitted Videos ({videos.length})</h3>
      <ul className="space-y-4">
        {videos.map((video: ScrapbookItemData) => (
          <li key={video.id} className="p-3 bg-card/70 rounded-md shadow-sm border border-border/50">
            <div className="flex items-center mb-1">
              <Video className="h-4 w-4 mr-2 text-accent2-DEFAULT"/>
              <p className="font-body font-medium text-foreground truncate">{video.title}</p>
            </div>
            <p className="font-body text-xs text-muted-foreground truncate " title={video.content}>URL/Embed: {video.content}</p>
            {video.contributor && <p className="font-body text-xs text-muted-foreground mt-0.5">By: {video.contributor}</p>}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}


export default function AdminVideosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-3 text-shadow-accent2">
            Admin Video Management
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Add pre-recorded video messages to Ramon's scrapbook.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm border-accent2-DEFAULT neon-glow-accent2">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-accent2-DEFAULT">Add New Video</CardTitle>
              <CardDescription className="font-body text-muted-foreground">
                Enter the details for the video message. These will be shown in the scrapbook.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoAdminForm />
            </CardContent>
          </Card>

          <Separator className="my-12 border-border/50" />
          
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm border-border neon-glow-accent1">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center text-accent1-DEFAULT">
                <ListVideo className="mr-2 h-6 w-6" /> Current Admin Videos
              </CardTitle>
              <CardDescription className="font-body text-muted-foreground">
                List of videos added through this panel. (Note: This list is session-based).
              </CardDescription>
            </CardHeader>
            <CardContent>
               <SubmittedVideosList />
            </CardContent>
          </Card>

        </div>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground font-body border-t border-border/30">
        Admin Panel - Ramon's 50th Celebration
      </footer>
    </div>
  );
}
