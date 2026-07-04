import { NextResponse } from 'next/server';
import { readUpcomingEvents } from '@/lib/upcoming-events/repository';
import { isFutureEvent } from '@/lib/upcoming-events/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const events = await readUpcomingEvents();
  const upcoming = events.filter(
    (event) => event.status === 'ACTIVE' && isFutureEvent(event.date, event.startTime),
  );

  return NextResponse.json({ events: upcoming });
}
