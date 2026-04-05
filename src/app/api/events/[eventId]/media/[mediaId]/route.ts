import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/admin';
import { readEvents, writeEvents } from '@/lib/events/repository';
import { deleteEventMedia } from '@/lib/events/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string; mediaId: string } },
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await readEvents();
    const eventIndex = events.findIndex((event) => event.id === params.eventId);
    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = events[eventIndex];
    const media = event.media.find((item) => item.id === params.mediaId);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    await deleteEventMedia(media.storagePath);

    const updatedEvent = {
      ...event,
      media: event.media.filter((item) => item.id !== params.mediaId),
      updatedAt: new Date().toISOString(),
    };

    events[eventIndex] = updatedEvent;
    await writeEvents(events);

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove media';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
