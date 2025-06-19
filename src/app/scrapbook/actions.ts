
'use server';

import type { ScrapbookItemData } from '@/types';
import { revalidatePath } from 'next/cache';
import { getAdminVideos } from '@/app/admin/videos/actions';

// Mock "database" for guestbook messages and user-uploaded photos
const userSubmissions: ScrapbookItemData[] = [
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

// Mock data for initial "Hype Reel" photos (curated, not user-submitted here)
const hypeReelPhotos: ScrapbookItemData[] = [
  {
    id: 'photo1_hype',
    type: 'photo',
    contributor: 'The Archives',
    title: 'Ramon @ Ultra \'19',
    content: 'https://placehold.co/600x400.png',
    timestamp: '2024-07-01T00:00:00Z',
    accentColor: 'accent2',
    dataAiHint: 'festival crowd'
  },
  {
    id: 'photo2_hype',
    type: 'photo',
    contributor: 'Old School Snaps',
    title: '90s Rave King',
    content: 'https://placehold.co/600x450.png',
    timestamp: '2024-07-01T00:01:00Z',
    accentColor: 'accent1',
    dataAiHint: 'dj turntables'
  },
   {
    id: 'photo3_hype',
    type: 'photo',
    contributor: 'Travel Bug',
    title: 'Ibiza Sunrise Set',
    content: 'https://placehold.co/500x700.png',
    timestamp: '2024-07-01T00:02:00Z',
    accentColor: 'accent2',
    dataAiHint: 'beach sunrise'
  },
];


export async function addMessageSubmission(prevState: any, formData: FormData) {
  const contributor = formData.get('contributor') as string;
  const title = formData.get('title') as string | null;
  const message = formData.get('message') as string; // This is the text from textarea (message or caption)
  const photoDataUri = formData.get('photoDataUri') as string | null; // This is the base64 data URI from hidden input

  if (!photoDataUri && !message) {
    return { error: 'Please provide either a message or upload a photo.' };
  }

  if (message && message.length > 1000) {
    return { error: 'Message or photo caption cannot exceed 1000 characters.' };
  }
  
  // Only enforce min length for message if it's a message-only post and message is not empty
  if (!photoDataUri && message && message.length > 0 && message.length < 5) {
    return { error: 'Message must be at least 5 characters long.' };
  }
  
  if (photoDataUri && !photoDataUri.startsWith('data:image/')) {
    return { error: 'Invalid photo data format.' };
  }


  let newItem: ScrapbookItemData;

  if (photoDataUri) {
    newItem = {
      id: `userphoto-${Date.now().toString()}`,
      type: 'photo',
      content: photoDataUri, // The data URI
      title: title || 'A new photo!',
      description: message || undefined, // Message from textarea becomes description for photo
      contributor: contributor || 'Anonymous Raver',
      timestamp: new Date().toISOString(),
      accentColor: Math.random() > 0.5 ? 'accent1' : 'accent2',
    };
  } else { // Message only
    newItem = {
      id: `usermsg-${Date.now().toString()}`,
      type: 'message',
      content: message, // The text message
      title: title || 'A new message!',
      // no description for message-only items
      contributor: contributor || 'Anonymous Raver',
      timestamp: new Date().toISOString(),
      accentColor: Math.random() > 0.5 ? 'accent1' : 'accent2',
    };
  }

  userSubmissions.unshift(newItem); // Add to the beginning of user submissions
  
  revalidatePath('/scrapbook');

  return { success: 'Your submission has been added!', item: newItem };
}

export async function getGuestbookMessages(): Promise<ScrapbookItemData[]> {
  // This function now effectively returns all user submissions (messages and photos)
  return userSubmissions;
}

export async function getScrapbookItems(): Promise<ScrapbookItemData[]> {
  const userSubmittedItems = await getGuestbookMessages(); // Renamed for clarity
  const adminVideos = await getAdminVideos();
  
  // Combine all items and sort by timestamp descending (newest first)
  // HypeReelPhotos are static curated content, userSubmissions are dynamic
  const allItems = [...userSubmittedItems, ...hypeReelPhotos, ...adminVideos];
  allItems.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
  
  return allItems;
}
