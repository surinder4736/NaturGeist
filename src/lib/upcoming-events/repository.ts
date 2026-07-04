import { readJson, uploadJson } from '@/lib/cloud-store/json-store';
import { UpcomingEventRecord, UpcomingEventsDataFile } from './types';

const PUBLIC_ID = 'naturgeist/data/upcoming-events';

function toTimestamp(date: string, startTime: string) {
  return new Date(`${date}T${startTime || '00:00'}`).getTime();
}

export async function readUpcomingEvents(): Promise<UpcomingEventRecord[]> {
  const payload = await readJson<UpcomingEventsDataFile>(PUBLIC_ID, { events: [] });
  const events = payload.events ?? [];

  return events.sort(
    (a, b) => toTimestamp(a.date, a.startTime) - toTimestamp(b.date, b.startTime),
  );
}

export async function writeUpcomingEvents(events: UpcomingEventRecord[]) {
  const payload: UpcomingEventsDataFile = { events };
  await uploadJson(PUBLIC_ID, payload);
}
