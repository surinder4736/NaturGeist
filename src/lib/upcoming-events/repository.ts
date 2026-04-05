import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { UpcomingEventRecord, UpcomingEventsDataFile } from './types';

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'upcoming-events.json');

async function ensureFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(filePath, 'utf-8');
  } catch {
    const initial: UpcomingEventsDataFile = { events: [] };
    await writeFile(filePath, JSON.stringify(initial, null, 2), 'utf-8');
  }
}

function toTimestamp(date: string, startTime: string) {
  return new Date(`${date}T${startTime || '00:00'}`).getTime();
}

export async function readUpcomingEvents() {
  await ensureFile();
  const raw = await readFile(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as UpcomingEventsDataFile;
  const events = parsed.events ?? [];

  return events.sort(
    (a, b) => toTimestamp(a.date, a.startTime) - toTimestamp(b.date, b.startTime),
  );
}

export async function writeUpcomingEvents(events: UpcomingEventRecord[]) {
  await ensureFile();
  const payload: UpcomingEventsDataFile = { events };
  await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');
}
