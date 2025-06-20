'use server';

import type { ScrapbookItemData } from '@/types';
import { revalidatePath } from 'next/cache';
import { getAdminVideos, deleteAdminVideo as actualDeleteAdminVideo, togglePinAdminVideo } from '@/app/admin/videos/actions';
import { enhanceScrapbookMessage, type EnhanceScrapbookMessageInput } from '@/ai/flows/enhance-scrapbook-message-flow';
import { promises as fs } from 'fs';
import path from 'path';
import { withLock } from '@/lib/file-lock';

// Path to the JSON file that acts as a mock database
const dbPath = path.join(process.cwd(), 'src', 'lib', 'scrapbook-items.json');

// Helper function to read the database file
async function readDbInternal(): Promise<ScrapbookItemData[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data) as ScrapbookItemData[];
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      // If file doesn't exist, create it with an empty array
      await fs.writeFile(dbPath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error("Critical error reading database file:", error);
    // For other errors, rethrow to be handled by the caller or withLock
    throw new Error(`Failed to read database file: ${(error as Error).message}`);
  }
}

// Helper function to write to the database file
async function writeDbInternal(data: ScrapbookItemData[]): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Critical error writing to database file:", error);
    throw new Error(`Failed to write to database file: ${(error as Error).message}`);
  }
}

export async function addMessageSubmission(prevState: any, formData: FormData) {
  const contributor = formData.get('contributor') as string;
  const userTitle = formData.get('title') as string | null;
  const userMessage = formData.get('message') as string;
  const photoDataUri = formData.get('photoDataUri') as string | null;

  if (!photoDataUri && !userMessage) {
    return { error: 'Please provide either a message or upload a photo.' };
  }

  if (userMessage && userMessage.length > 1000) {
    return { error: 'Message or photo caption cannot exceed 1000 characters.' };
  }
  
  if (!photoDataUri && userMessage && userMessage.length > 0 && userMessage.length < 5) {
    return { error: 'Message must be at least 5 characters long.' };
  }
  
  if (photoDataUri && !photoDataUri.startsWith('data:image/')) {
    return { error: 'Invalid photo data format. Please check the uploaded file.' };
  }
  
  // Validate photo size (approx 5MB limit for the original file)
  const MAX_DATA_URI_LENGTH = 7000000; // Approx 5.25MB file
  if (photoDataUri && photoDataUri.length > MAX_DATA_URI_LENGTH) {
    return { error: 'Photo is too large. Please upload a file smaller than 5MB.' };
  }

  let enhancedTitle = userTitle || 'A heartfelt submission!';
  let enhancedMessage = userMessage;
  let suggestedAccentColor: 'accent1' | 'accent2' = Math.random() > 0.5 ? 'accent1' : 'accent2';

  if (userMessage) {
    try {
      const aiInput: EnhanceScrapbookMessageInput = {
        originalMessage: userMessage,
        originalTitle: userTitle || undefined,
      };
      const aiResponse = await enhanceScrapbookMessage(aiInput);
      enhancedTitle = aiResponse.enhancedTitle;
      enhancedMessage = aiResponse.enhancedMessage;
      suggestedAccentColor = aiResponse.suggestedAccentColor;
    } catch (aiError) {
      if (process.env.NODE_ENV === 'development') {
        console.error("AI message enhancement failed (dev mode):", aiError);
      } else {
        console.error("AI message enhancement failed:", (aiError instanceof Error ? aiError.message : String(aiError)));
      }
      // Use a more user-friendly error, or proceed with non-enhanced content
      // For now, we'll proceed with non-enhanced if AI fails but log it.
      // A toast could inform the user that AI enhancement couldn't be applied.
    }
  }
  
  let newItem: ScrapbookItemData;

  if (photoDataUri) {
    newItem = {
      id: `userphoto-${Date.now().toString()}`,
      type: 'photo',
      content: photoDataUri,
      title: enhancedTitle,
      description: enhancedMessage || undefined,
      contributor: contributor || 'Anonymous Guest',
      timestamp: new Date().toISOString(),
      accentColor: suggestedAccentColor,
      pinned: false,
    };
  } else {
    newItem = {
      id: `usermsg-${Date.now().toString()}`,
      type: 'message',
      content: enhancedMessage, // Should be non-null if photoDataUri is null based on initial checks
      title: enhancedTitle,
      contributor: contributor || 'Anonymous Guest',
      timestamp: new Date().toISOString(),
      accentColor: suggestedAccentColor,
      pinned: false,
    };
  }

  try {
    await withLock(dbPath, async () => {
      const items = await readDbInternal();
      items.unshift(newItem);
      await writeDbInternal(items);
    });

    revalidatePath('/scrapbook');
    revalidatePath('/admin/videos'); // Admin videos might be displayed alongside

    return { success: 'Your submission has been added!', item: newItem };
  } catch (error) {
    console.error("Failed to add message submission due to file lock or write error:", error);
    return { error: `An error occurred while saving your submission: ${(error as Error).message}. Please try again.` };
  }
}

export async function getScrapbookItems(): Promise<ScrapbookItemData[]> {
  try {
    const [userAndHypeItems, adminVideos] = await Promise.all([
      withLock(dbPath, readDbInternal),
      getAdminVideos() // Operates on in-memory data, no lock needed for dbPath
    ]);

    const allItems = [...userAndHypeItems, ...adminVideos];

    allItems.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    return allItems;
  } catch (error) {
    console.error("Failed to get scrapbook items:", error);
    // Return empty array or a default state to prevent page crash
    return []; 
  }
}


export async function togglePinScrapbookItem(itemId: string, prevState?: any, formData?: FormData) {
  try {
    let resultMessage: string | null = null;
    let foundInUserItems = false;

    await withLock(dbPath, async () => {
      const items = await readDbInternal();
      const itemIndex = items.findIndex(item => item.id === itemId);

      if (itemIndex !== -1) {
        foundInUserItems = true;
        items[itemIndex].pinned = !items[itemIndex].pinned;
        await writeDbInternal(items);
        resultMessage = `Item ${items[itemIndex].pinned ? 'pinned' : 'unpinned'} successfully.`;
      }
    });

    if (foundInUserItems && resultMessage) {
      revalidatePath('/scrapbook');
      return { success: resultMessage };
    }

    // If not found in user items, try admin videos
    // togglePinAdminVideo is for in-memory admin videos, no dbPath lock needed here
    const adminVideoResult = await togglePinAdminVideo(itemId, null, formData || new FormData()); 
    if (adminVideoResult.success || adminVideoResult.error) {
      revalidatePath('/scrapbook'); // Revalidate as admin videos affect the scrapbook
      return adminVideoResult;
    }

    return { error: 'Item not found or could not be pinned.' };
  } catch (error) {
    console.error("Failed to toggle pin for item:", itemId, error);
    return { error: `An error occurred while toggling pin status: ${(error as Error).message}.` };
  }
}


export async function deleteScrapbookItem(itemId: string, prevState?: any, formData?: FormData) {
  try {
    let resultMessage: string | null = null;
    let foundInUserItems = false;

    await withLock(dbPath, async () => {
      const items = await readDbInternal();
      const itemIndex = items.findIndex(item => item.id === itemId);

      if (itemIndex !== -1) {
        foundInUserItems = true;
        items.splice(itemIndex, 1);
        await writeDbInternal(items);
        resultMessage = 'Item deleted successfully.';
      }
    });
    
    if (foundInUserItems && resultMessage) {
      revalidatePath('/scrapbook');
      return { success: resultMessage };
    }

    // If not found, try deleting an admin video
    // actualDeleteAdminVideo is for in-memory admin videos
    const adminDeleteResult = await actualDeleteAdminVideo(itemId);
    if (adminDeleteResult.success || adminDeleteResult.error) {
      revalidatePath('/scrapbook'); // Revalidate as admin videos affect the scrapbook
      return adminDeleteResult;
    }

    return { error: 'Item not found or could not be deleted.' };
  } catch (error) {
    console.error("Failed to delete item:", itemId, error);
    return { error: `An error occurred while deleting the item: ${(error as Error).message}.` };
  }
}
