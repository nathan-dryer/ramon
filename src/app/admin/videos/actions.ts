
'use server';

import type { ScrapbookItemData } from '@/types';
import { revalidatePath } from 'next/cache';

// This is a mock "database". In a real app, use a proper database.
const videoSubmissions: ScrapbookItemData[] = [];

export async function addVideoSubmission(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const videoUrl = formData.get('videoUrl') as string;
  const contributor = formData.get('contributor') as string | null;

  if (!title || !videoUrl) {
    return { error: 'Title and Video URL are required.' };
  }

  if (!videoUrl.startsWith('http://') && !videoUrl.startsWith('https://') && !videoUrl.startsWith('<iframe')) {
     if (!videoUrl.includes('youtube.com/embed') && !videoUrl.includes('player.vimeo.com/video')) {
        return { error: 'Invalid video URL format. Please provide a valid embed URL or iframe code.' };
     }
  }
  
  const newVideo: ScrapbookItemData = {
    id: Date.now().toString(),
    type: 'video',
    title,
    content: videoUrl,
    contributor: contributor || 'Site Admin',
    timestamp: new Date().toISOString(),
    accentColor: Math.random() > 0.5 ? 'accent1' : 'accent2',
    pinned: false, // Initialize pinned to false
  };

  videoSubmissions.push(newVideo);
  console.log('New video added:', newVideo);
  
  revalidatePath('/scrapbook');
  revalidatePath('/admin/videos');

  return { success: 'Video added successfully!', video: newVideo };
}

export async function getAdminVideos(): Promise<ScrapbookItemData[]> {
  // Sort by timestamp so newest appear first in admin list as well
  return [...videoSubmissions].sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
}

export async function togglePinAdminVideo(videoId: string, prevState: any, formData: FormData) {
  const videoIndex = videoSubmissions.findIndex(v => v.id === videoId);
  if (videoIndex === -1) {
    return { error: 'Video not found.' };
  }

  const currentPinnedStatus = videoSubmissions[videoIndex].pinned;
  videoSubmissions[videoIndex].pinned = !currentPinnedStatus;
  
  console.log(`Video ${videoId} pinned status changed to: ${videoSubmissions[videoIndex].pinned}`);

  revalidatePath('/scrapbook');
  revalidatePath('/admin/videos');

  return { success: `Video ${videoSubmissions[videoIndex].pinned ? 'pinned' : 'unpinned'} successfully.` };
}
