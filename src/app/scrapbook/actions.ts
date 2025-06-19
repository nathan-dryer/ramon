
'use server';

import type { ScrapbookItemData } from '@/types';
import { revalidatePath } from 'next/cache';
import { getAdminVideos, videoSubmissions as adminVideoStore, deleteAdminVideo as actualDeleteAdminVideo } from '@/app/admin/videos/actions';

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
    pinned: false,
  },
  {
    id: 'msg2',
    type: 'message',
    contributor: 'The Glowstick Crew',
    title: 'To many more raves!',
    content: "Happy 50th, Ramon! May your energy never fade and your glowsticks always shine bright. We're bringing the good vibes and neon paint! 🎉✨",
    timestamp: '2024-07-11T14:30:00Z',
    accentColor: 'accent2',
    pinned: false,
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
    dataAiHint: 'festival crowd',
    pinned: true, 
  },
  {
    id: 'photo2_hype',
    type: 'photo',
    contributor: 'Old School Snaps',
    title: '90s Rave King',
    content: 'https://placehold.co/600x450.png',
    timestamp: '2024-07-01T00:01:00Z',
    accentColor: 'accent1',
    dataAiHint: 'dj turntables',
    pinned: false,
  },
   {
    id: 'photo3_hype',
    type: 'photo',
    contributor: 'Travel Bug',
    title: 'Ibiza Sunrise Set',
    content: 'https://placehold.co/500x700.png',
    timestamp: '2024-07-01T00:02:00Z',
    accentColor: 'accent2',
    dataAiHint: 'beach sunrise',
    pinned: false,
  },
];


export async function addMessageSubmission(prevState: any, formData: FormData) {
  const contributor = formData.get('contributor') as string;
  const title = formData.get('title') as string | null;
  const message = formData.get('message') as string; 
  const photoDataUri = formData.get('photoDataUri') as string | null; 

  if (!photoDataUri && !message) {
    return { error: 'Please provide either a message or upload a photo.' };
  }

  if (message && message.length > 1000) {
    return { error: 'Message or photo caption cannot exceed 1000 characters.' };
  }
  
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
      content: photoDataUri, 
      title: title || 'A new photo!',
      description: message || undefined, 
      contributor: contributor || 'Anonymous Guest',
      timestamp: new Date().toISOString(),
      accentColor: Math.random() > 0.5 ? 'accent1' : 'accent2',
      pinned: false,
    };
  } else { 
    newItem = {
      id: `usermsg-${Date.now().toString()}`,
      type: 'message',
      content: message, 
      title: title || 'A new message!',
      contributor: contributor || 'Anonymous Guest',
      timestamp: new Date().toISOString(),
      accentColor: Math.random() > 0.5 ? 'accent1' : 'accent2',
      pinned: false,
    };
  }

  userSubmissions.unshift(newItem); 
  
  revalidatePath('/scrapbook');
  revalidatePath('/admin/videos'); 

  return { success: 'Your submission has been added!', item: newItem };
}

export async function getGuestbookMessages(): Promise<ScrapbookItemData[]> {
  return userSubmissions;
}

export async function getScrapbookItems(): Promise<ScrapbookItemData[]> {
  const userSubmittedItems = await getGuestbookMessages(); 
  const adminVideos = await getAdminVideos(); // Fetches from admin/videos/actions.ts
  
  const allItems = [...userSubmittedItems, ...hypeReelPhotos, ...adminVideos];
  
  allItems.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
  });
  
  return allItems;
}

export async function togglePinScrapbookItem(itemId: string, prevState?: any, formData?: FormData) {
  let itemFound = false;
  let currentPinnedStatus: boolean | undefined = false;

  const collections = [userSubmissions, hypeReelPhotos, adminVideoStore];
  for (const collection of collections) {
    const itemIndex = collection.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      currentPinnedStatus = collection[itemIndex].pinned;
      collection[itemIndex].pinned = !collection[itemIndex].pinned;
      itemFound = true;
      break;
    }
  }

  if (!itemFound) {
    return { error: 'Item not found.' };
  }

  revalidatePath('/scrapbook');
  revalidatePath('/admin/videos'); // In case an admin video was pinned/unpinned

  return { success: `Item ${!currentPinnedStatus ? 'pinned' : 'unpinned'} successfully.` };
}

export async function deleteScrapbookItem(itemId: string, prevState?: any, formData?: FormData) {
  let itemFoundAndDeleted = false;

  const findAndSplice = (collection: ScrapbookItemData[]) => {
    const index = collection.findIndex(item => item.id === itemId);
    if (index !== -1) {
      collection.splice(index, 1);
      return true;
    }
    return false;
  };

  if (findAndSplice(userSubmissions) || findAndSplice(hypeReelPhotos)) {
    itemFoundAndDeleted = true;
  } else {
    // Check if it's an admin video and use its specific delete function
    const adminVideoIndex = adminVideoStore.findIndex(v => v.id === itemId);
    if (adminVideoIndex !== -1) {
      await actualDeleteAdminVideo(itemId); // This already revalidates paths
      itemFoundAndDeleted = true; 
      // actualDeleteAdminVideo handles revalidation, so we can return early or skip double revalidation
      return { success: 'Admin video deleted successfully.' };
    }
  }

  if (!itemFoundAndDeleted) {
    return { error: 'Item not found.' };
  }

  revalidatePath('/scrapbook');
  revalidatePath('/admin/videos'); 

  return { success: 'Item deleted successfully.' };
}
