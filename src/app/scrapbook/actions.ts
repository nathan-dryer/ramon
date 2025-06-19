
'use server';

import type { ScrapbookItemData } from '@/types';
import { revalidatePath } from 'next/cache';
import { getAdminVideos, deleteAdminVideo as actualDeleteAdminVideo, togglePinAdminVideo } from '@/app/admin/videos/actions';

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
  revalidatePath('/admin/videos'); // In case an admin video was pinned/unpinned from scrapbook

  return { success: 'Your submission has been added!', item: newItem };
}

export async function getGuestbookMessages(): Promise<ScrapbookItemData[]> {
  // This function might not be strictly needed if getScrapbookItems covers all cases
  return [...userSubmissions];
}

export async function getScrapbookItems(): Promise<ScrapbookItemData[]> {
  // Fetch all sources of items
  const userSubmittedItems = [...userSubmissions]; 
  const adminVideos = await getAdminVideos();
  const curatedPhotos = [...hypeReelPhotos];
  
  const allItems = [...userSubmittedItems, ...curatedPhotos, ...adminVideos];
  
  // Sort: Pinned items first, then by timestamp descending
  allItems.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // Fallback to 0 if timestamp is undefined to prevent crashes, though ideally all items have timestamps
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeB - timeA;
  });
  
  return allItems;
}

export async function togglePinScrapbookItem(itemId: string, prevState?: any, formData?: FormData) {
  // Try user submissions
  const userItemIndex = userSubmissions.findIndex(item => item.id === itemId);
  if (userItemIndex !== -1) {
    userSubmissions[userItemIndex].pinned = !userSubmissions[userItemIndex].pinned;
    revalidatePath('/scrapbook');
    return { success: `Item ${userSubmissions[userItemIndex].pinned ? 'pinned' : 'unpinned'} successfully.` };
  }

  // Try hype reel photos
  const hypeReelItemIndex = hypeReelPhotos.findIndex(item => item.id === itemId);
  if (hypeReelItemIndex !== -1) {
    hypeReelPhotos[hypeReelItemIndex].pinned = !hypeReelPhotos[hypeReelItemIndex].pinned;
    revalidatePath('/scrapbook');
    return { success: `Item ${hypeReelPhotos[hypeReelItemIndex].pinned ? 'pinned' : 'unpinned'} successfully.` };
  }

  // Try admin videos by calling its specific togglePin action
  // togglePinAdminVideo is expected to handle its own revalidation and error/success reporting.
  const adminVideoResult = await togglePinAdminVideo(itemId, null, formData || new FormData()); 
  if (adminVideoResult.success || adminVideoResult.error) { // Check if the action was relevant (found the video)
    revalidatePath('/scrapbook'); // Ensure scrapbook updates if an admin video's pin status changed
    return adminVideoResult;
  }
  
  return { error: 'Item not found or could not be pinned.' };
}

export async function deleteScrapbookItem(itemId: string, prevState?: any, formData?: FormData) {
  const findAndSplice = (collection: ScrapbookItemData[], id: string) => {
    const index = collection.findIndex(item => item.id === id);
    if (index !== -1) {
      collection.splice(index, 1);
      return true;
    }
    return false;
  };

  if (findAndSplice(userSubmissions, itemId)) {
    revalidatePath('/scrapbook');
    return { success: 'User submission deleted successfully.' };
  }

  if (findAndSplice(hypeReelPhotos, itemId)) {
    revalidatePath('/scrapbook');
    return { success: 'Hype reel photo deleted successfully.' };
  }

  // Try deleting as an admin video
  // actualDeleteAdminVideo (deleteAdminVideo from admin actions) handles its own revalidation
  const adminDeleteResult = await actualDeleteAdminVideo(itemId);
  if (adminDeleteResult.success || adminDeleteResult.error) { // Check if the action was relevant
     revalidatePath('/scrapbook'); // Ensure scrapbook updates if an admin video was deleted
    return adminDeleteResult;
  }
  
  return { error: 'Item not found or could not be deleted.' };
}
