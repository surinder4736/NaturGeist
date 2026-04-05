export type UpcomingEventStatus = 'ACTIVE' | 'DRAFT' | 'CANCELLED';

export interface UpcomingEventSpeaker {
  id: string;
  name: string;
  designation: string;
  imageUrl: string;
  imageStoragePath: string;
}

export interface UpcomingEventRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  actionLink: string;
  status: UpcomingEventStatus;
  bannerUrl: string;
  bannerStoragePath: string;
  speakers: UpcomingEventSpeaker[];
  createdAt: string;
  updatedAt: string;
}

export interface UpcomingEventsDataFile {
  events: UpcomingEventRecord[];
}
