'use server';

import type { ScrapbookItemData } from '@/types';
import { revalidatePath } from 'next/cache';
import { getAdminVideos } from '@/app/admin/videos/actions';

// Mock "database" for guestbook messages
const guestbookMessages: ScrapbookItemData[] = [
  {
    id: 'msg1',
    type: 'message',
    contributor: 'DJ RaveDave',
    title: 'Can\'t wait to drop some beats!',
    content: "Ramon my man! Heard it's the big 5-0. Get ready for an epic night, the tunes will be legendary. See you on the dance floor! 🔥🎧",
    timestamp: '2024-07-10T10:00:00Z',
    accentColor: 'accent1',
  },
  {
    id: 'msg2',
    type: 'message',
    contributor: 'The Glowstick Crew',
    title: 'To many more raves!',
    content: "Happy 50th, Ramon! May your energy never fade and your glowsticks always shine bright. We're bringing the good vibes and neon paint! 🎉✨",
    timestamp: '2024-07-11T14:30:00Z',
    accentColor: 'accent2',
  },
];

// Mock data for initial "Hype Reel" photos
const hypeReelPhotos: ScrapbookItemData[] = [
  {
    id: 'photo1_hype',
    type: 'photo',
    contributor: 'The Archives',
    title: 'Ramon @ Ultra \'19',
    content: 'https://placehold.co/600x400.png',
    timestamp: '2024-07-01T00:00:00Z',
    accentColor: 'accent2',
  },
  {
    id: 'photo2_hype',
    type: 'photo',
    contributor: 'Old School Snaps',
    title: '90s Rave King',
    content: 'https://placehold.co/600x450.png',
    timestamp: '2024-07-01T00:01:00Z',
    accentColor: 'accent1',
  },
   {
    id: 'photo3_hype',
    type: 'photo',
    contributor: 'Travel Bug',
    title: 'Ibiza Sunrise Set',
    content: 'https://placehold.co/500x700.png',
    timestamp: '2024-07-01T00:02:00Z',
    accentColor: 'accent2',
  },
];


export async function addMessageSubmission(formData: FormData) {
  const contributor = formData.get('contributor') as string;
  const message = formData.get('message') as string;
  const title = formData.get('title') as string | null;

  if (!message) {
    return { error: 'Message content is required.' };
  }
  if (message.length < 5) {
    return { error: 'Message must be at least 5 characters long.'}
  }
   if (message.length > 1000) {
    return { error: 'Message cannot exceed 1000 characters.'}
  }


  const newMessage: ScrapbookItemData = {
    id: `msg-${Date.now().toString()}`,
    type: 'message',
    title: title || 'A new message!',
    content: message,
    contributor: contributor || 'Anonymous Raver',
    timestamp: new Date().toISOString(),
    accentColor: Math.random() > 0.5 ? 'accent1' : 'accent2',
  };

  guestbookMessages.unshift(newMessage); // Add to the beginning
  
  revalidatePath('/scrapbook');

  return { success: 'Message added successfully!', message: newMessage };
}

export async function getGuestbookMessages(): Promise<ScrapbookItemData[]> {
  return guestbookMessages;
}

export async function getScrapbookItems(): Promise<ScrapbookItemData[]> {
  const messages = await getGuestbookMessages();
  const videos = await getAdminVideos();
  
  // Combine all items and sort by timestamp descending (newest first)
  const allItems = [...messages, ...hypeReelPhotos, ...videos];
  allItems.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
  
  return allItems;
}
