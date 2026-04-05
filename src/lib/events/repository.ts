import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { EventRecord, EventsDataFile } from './types';

const dataDir = path.join(process.cwd(), 'data');
const eventsFilePath = path.join(dataDir, 'events.json');

async function ensureEventsFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(eventsFilePath, 'utf-8');
  } catch {
    const initial: EventsDataFile = { events: [] };
    await writeFile(eventsFilePath, JSON.stringify(initial, null, 2), 'utf-8');
  }
}

export async function readEvents(): Promise<EventRecord[]> {
  await ensureEventsFile();
  const raw = await readFile(eventsFilePath, 'utf-8');
  const parsed = JSON.parse(raw) as EventsDataFile;
  const events = parsed.events ?? [];

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

export async function writeEvents(events: EventRecord[]) {
  await ensureEventsFile();
  const payload: EventsDataFile = { events };
  await writeFile(eventsFilePath, JSON.stringify(payload, null, 2), 'utf-8');
}
