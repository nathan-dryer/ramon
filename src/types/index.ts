export type ScrapbookItemType = 'message' | 'photo' | 'video';

export interface ScrapbookItemData {
  id: string;
  type: ScrapbookItemType;
  contributor?: string;
  content: string; // For message text, photo URL, or video URL/embed code
  title?: string;
  timestamp?: string; // ISO string date
  accentColor?: 'magenta' | 'gold'; // For item-specific accent
}
