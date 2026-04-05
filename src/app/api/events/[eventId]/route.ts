import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminRequest } from '@/lib/auth/admin';
import { readEvents, writeEvents } from '@/lib/events/repository';
import { deleteEventMedia, uploadEventMedia } from '@/lib/events/storage';
import { detectMediaType, validateMediaFile } from '@/lib/events/validation';

const updateSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { eventId: string } },
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = String(formData.get('title') || '');
    const date = String(formData.get('date') || '');
    const parsed = updateSchema.safeParse({ title, date });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 },
      );
    }

    const incomingFiles = formData
      .getAll('media')
      .filter((value): value is File => value instanceof File && value.size > 0);

    for (const file of incomingFiles) {
      const validationError = validateMediaFile(file);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    const events = await readEvents();
    const targetIndex = events.findIndex((event) => event.id === params.eventId);
    if (targetIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = events[targetIndex];
    const now = new Date().toISOString();
    const newMedia = [];

    for (const file of incomingFiles) {
      const mediaType = detectMediaType(file);
      if (!mediaType) continue;
      const uploadResult = await uploadEventMedia(file, parsed.data.date, event.id);
      newMedia.push({
        id: randomUUID(),
        type: mediaType,
        url: uploadResult.url,
        storagePath: uploadResult.storagePath,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        createdAt: now,
      });
    }

    const updatedEvent = {
      ...event,
      title: parsed.data.title,
      date: parsed.data.date,
      media: [...event.media, ...newMedia],
      updatedAt: now,
    };

    events[targetIndex] = updatedEvent;
    await writeEvents(events);

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string } },
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await readEvents();
    const target = events.find((event) => event.id === params.eventId);
    if (!target) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    for (const mediaItem of target.media) {
      await deleteEventMedia(mediaItem.storagePath);
    }

    const filtered = events.filter((event) => event.id !== params.eventId);
    await writeEvents(filtered);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
