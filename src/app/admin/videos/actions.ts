'use server';

import type { ScrapbookItemData } from '@/types';
import { revalidatePath } from 'next/cache';

// This is a mock "database". In a real app, use a proper database.
const videoSubmissions: ScrapbookItemData[] = [];

export async function addVideoSubmission(formData: FormData) {
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
  };

  videoSubmissions.push(newVideo);
  console.log('New video added:', newVideo);
  
  revalidatePath('/scrapbook');
  revalidatePath('/admin/videos');

  return { success: 'Video added successfully!', video: newVideo };
}

export async function getAdminVideos(): Promise<ScrapbookItemData[]> {
  return videoSubmissions;
}
