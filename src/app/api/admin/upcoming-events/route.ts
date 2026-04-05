import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/admin';
import { uploadEventMedia } from '@/lib/events/storage';
import { readUpcomingEvents, writeUpcomingEvents } from '@/lib/upcoming-events/repository';
import {
  upcomingEventSchema,
  validateSpeakerImage,
  validateTimeRange,
  validateUpcomingBanner,
} from '@/lib/upcoming-events/validation';
import { UpcomingEventRecord, UpcomingEventSpeaker } from '@/lib/upcoming-events/types';

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const events = await readUpcomingEvents();
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const parsed = upcomingEventSchema.safeParse({
      title: String(formData.get('title') || ''),
      description: String(formData.get('description') || ''),
      date: String(formData.get('date') || ''),
      startTime: String(formData.get('startTime') || ''),
      endTime: String(formData.get('endTime') || ''),
      location: String(formData.get('location') || ''),
      actionLink: String(formData.get('actionLink') || ''),
      status: String(formData.get('status') || ''),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 },
      );
    }

    if (!validateTimeRange(parsed.data.startTime, parsed.data.endTime)) {
      return NextResponse.json(
        { error: 'End time must be later than start time' },
        { status: 400 },
      );
    }

    const banner = formData.get('banner');
    if (!(banner instanceof File)) {
      return NextResponse.json({ error: 'Banner image is required' }, { status: 400 });
    }

    const bannerError = validateUpcomingBanner(banner);
    if (bannerError) {
      return NextResponse.json({ error: bannerError }, { status: 400 });
    }

    const eventId = randomUUID();
    const upload = await uploadEventMedia(banner, parsed.data.date, eventId);
    let speakersPayload: Array<{
      id?: string;
      name: string;
      designation: string;
    }> = [];
    try {
      speakersPayload = JSON.parse(String(formData.get('speakersJson') || '[]'));
    } catch {
      return NextResponse.json({ error: 'Invalid speakers payload' }, { status: 400 });
    }

    const speakers: UpcomingEventSpeaker[] = [];
    for (let i = 0; i < speakersPayload.length; i += 1) {
      const item = speakersPayload[i];
      const name = String(item.name || '').trim();
      const designation = String(item.designation || '').trim();
      if (!name || !designation) {
        return NextResponse.json(
          { error: `Speaker ${i + 1} name and designation are required` },
          { status: 400 },
        );
      }

      const speakerImage = formData.get(`speakerImage_${i}`);
      if (!(speakerImage instanceof File) || speakerImage.size === 0) {
        return NextResponse.json(
          { error: `Speaker ${i + 1} image is required` },
          { status: 400 },
        );
      }

      const speakerImageError = validateSpeakerImage(speakerImage);
      if (speakerImageError) {
        return NextResponse.json({ error: speakerImageError }, { status: 400 });
      }

      const speakerUpload = await uploadEventMedia(
        speakerImage,
        parsed.data.date,
        `${eventId}-speaker-${i}`,
      );

      speakers.push({
        id: randomUUID(),
        name,
        designation,
        imageUrl: speakerUpload.url,
        imageStoragePath: speakerUpload.storagePath,
      });
    }

    const now = new Date().toISOString();

    const newEvent: UpcomingEventRecord = {
      id: eventId,
      ...parsed.data,
      bannerUrl: upload.url,
      bannerStoragePath: upload.storagePath,
      speakers,
      createdAt: now,
      updatedAt: now,
    };

    const events = await readUpcomingEvents();
    await writeUpcomingEvents([...events, newEvent]);
    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
