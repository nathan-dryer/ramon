
'use server';

import type { ScrapbookItemData } from '@/types';
import { revalidatePath } from 'next/cache';

// This is a mock "database". In a real app, use a proper database.
// NOT exporting this directly anymore. It's managed internally by this module.
const videoSubmissions: ScrapbookItemData[] = [];

export async function addVideoSubmission(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const videoUrl = formData.get('videoUrl') as string;
  const contributor = formData.get('contributor') as string | null;
  const autoplay = formData.get('autoplay') === 'on';

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
    pinned: false,
    autoplay: autoplay,
  };

  videoSubmissions.unshift(newVideo); // Add to the beginning of the array
  
  revalidatePath('/scrapbook');
  revalidatePath('/admin/videos');

  return { success: 'Video added successfully!', video: newVideo };
}

export async function getAdminVideos(): Promise<ScrapbookItemData[]> {
  // Sort by timestamp so newest appear first in admin list as well, but also consistent for scrapbook sorting
  return [...videoSubmissions].sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
}

export async function togglePinAdminVideo(videoId: string, prevState: any, formData?: FormData) { // formData can be optional
  const videoIndex = videoSubmissions.findIndex(v => v.id === videoId);
  if (videoIndex === -1) {
    return { error: 'Admin video not found.' };
  }

  const currentPinnedStatus = videoSubmissions[videoIndex].pinned;
  videoSubmissions[videoIndex].pinned = !currentPinnedStatus;
  
  revalidatePath('/scrapbook');
  revalidatePath('/admin/videos');

  return { success: `Admin video ${videoSubmissions[videoIndex].pinned ? 'pinned' : 'unpinned'} successfully.` };
}

export async function deleteAdminVideo(videoId: string): Promise<{ success?: string; error?: string }> {
  const videoIndex = videoSubmissions.findIndex(v => v.id === videoId);
  if (videoIndex === -1) {
    return { error: 'Admin video not found.' };
  }

  videoSubmissions.splice(videoIndex, 1);

  revalidatePath('/scrapbook');
  revalidatePath('/admin/videos');
  
  return { success: 'Admin video deleted successfully.' };
}
