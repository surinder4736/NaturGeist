import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/admin';
import { readEvent, updateEvent } from '@/lib/events/repository';
import { deleteEventMedia } from '@/lib/events/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string; mediaId: string } },
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const event = await readEvent(params.eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const media = event.media.find((item) => item.id === params.mediaId);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    await deleteEventMedia(media.storagePath, media.type);

    const updatedEvent = {
      ...event,
      media: event.media.filter((item) => item.id !== params.mediaId),
      updatedAt: new Date().toISOString(),
    };

    await updateEvent(updatedEvent);

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove media';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
