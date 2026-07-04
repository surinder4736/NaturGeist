import { deleteJson, listJsonByPrefix, readJson, uploadJson } from '@/lib/cloud-store/json-store';
import { EventRecord } from './types';

const PREFIX = 'naturgeist/data/events/';

function eventPublicId(eventId: string) {
  return `${PREFIX}${eventId}`;
}

export async function readEvents(): Promise<EventRecord[]> {
  const items = await listJsonByPrefix<EventRecord>(PREFIX);
  return items.map((item) => item.data).sort((a, b) => b.date.localeCompare(a.date));
}

export async function readEvent(eventId: string): Promise<EventRecord | null> {
  return readJson<EventRecord | null>(eventPublicId(eventId), null);
}

export async function createEvent(event: EventRecord): Promise<void> {
  await uploadJson(eventPublicId(event.id), event);
}

export async function updateEvent(event: EventRecord): Promise<void> {
  await uploadJson(eventPublicId(event.id), event);
}

export async function deleteEvent(eventId: string): Promise<void> {
  await deleteJson(eventPublicId(eventId));
}
