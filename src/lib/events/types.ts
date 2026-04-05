export type EventMediaType = 'image' | 'video';

export interface EventMedia {
  id: string;
  type: EventMediaType;
  url: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface EventRecord {
  id: string;
  title: string;
  date: string;
  media: EventMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface EventsDataFile {
  events: EventRecord[];
}
