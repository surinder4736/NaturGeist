import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminRequest } from '@/lib/auth/admin';
import { readEvents, writeEvents } from '@/lib/events/repository';
import { uploadEventMedia } from '@/lib/events/storage';
import { detectMediaType, validateMediaFile } from '@/lib/events/validation';
import { EventRecord } from '@/lib/events/types';

const createSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export async function GET(request: NextRequest) {
  const events = await readEvents();
  const params = request.nextUrl.searchParams;
  const pastOnly = params.get('pastOnly') === '1';

  if (!pastOnly) {
    return NextResponse.json({ events });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filtered = events.filter((event) => new Date(event.date).getTime() <= today.getTime());
  return NextResponse.json({ events: filtered });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = String(formData.get('title') || '');
    const date = String(formData.get('date') || '');
    const parsed = createSchema.safeParse({ title, date });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 },
      );
    }

    const uploadedFiles = formData
      .getAll('media')
      .filter((value): value is File => value instanceof File && value.size > 0);

    for (const file of uploadedFiles) {
      const validationError = validateMediaFile(file);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    const events = await readEvents();
    const now = new Date().toISOString();
    const eventId = randomUUID();
    const media = [];

    for (const file of uploadedFiles) {
      const mediaType = detectMediaType(file);
      if (!mediaType) continue;

      const uploadResult = await uploadEventMedia(file, parsed.data.date, eventId);
      media.push({
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

    const createdEvent: EventRecord = {
      id: eventId,
      title: parsed.data.title,
      date: parsed.data.date,
      media,
      createdAt: now,
      updatedAt: now,
    };

    const nextEvents = [createdEvent, ...events];
    await writeEvents(nextEvents);

    return NextResponse.json({ event: createdEvent }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
