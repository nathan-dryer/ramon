
export type ScrapbookItemType = 'message' | 'photo' | 'video';

export interface ScrapbookItemData {
  id: string;
  type: ScrapbookItemType;
  contributor?: string;
  content: string; // For message text, photo URL/DataURI, or video URL/embed code
  title?: string;
  description?: string; // Optional message to accompany a photo
  timestamp?: string; // ISO string date
  accentColor?: 'accent1' | 'accent2'; // For item-specific accent (e.g., magenta or cyan)
}
