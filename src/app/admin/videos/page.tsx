import { SiteHeader } from '@/components/layout/SiteHeader';
import { VideoAdminForm } from './VideoAdminForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAdminVideos } from './actions';
import type { ScrapbookItemData } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Video } from 'lucide-react';

async function SubmittedVideosList() {
  const videos = await getAdminVideos();

  if (videos.length === 0) {
    return <p className="font-body text-muted-foreground text-center py-4">No videos submitted yet via admin panel.</p>;
  }

  return (
    <ScrollArea className="h-[400px] mt-6 rounded-md border p-4">
      <h3 className="font-headline text-lg mb-4 text-primary">Submitted Videos ({videos.length})</h3>
      <ul className="space-y-4">
        {videos.map((video: ScrapbookItemData) => (
          <li key={video.id} className="p-3 bg-secondary/50 rounded-md shadow-sm">
            <div className="flex items-center mb-1">
              <Video className="h-4 w-4 mr-2 text-accent"/>
              <p className="font-body font-medium text-primary truncate">{video.title}</p>
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
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-3">
            Admin Video Management
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Add pre-recorded video messages to Ramon's scrapbook.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Add New Video</CardTitle>
              <CardDescription className="font-body">
                Enter the details for the video message. These will be shown in the scrapbook.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoAdminForm />
            </CardContent>
          </Card>

          <Separator className="my-12" />
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Current Admin Videos</CardTitle>
              <CardDescription className="font-body">
                List of videos added through this panel. (Note: This list is currently session-based for demo purposes).
              </CardDescription>
            </CardHeader>
            <CardContent>
               <SubmittedVideosList />
            </CardContent>
          </Card>

        </div>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground font-body">
        Admin Panel - Ramon's 50th Celebration
      </footer>
    </div>
  );
}
