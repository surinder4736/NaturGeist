import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/admin';
import { deleteEventMedia, uploadEventMedia } from '@/lib/events/storage';
import { readUpcomingEvents, writeUpcomingEvents } from '@/lib/upcoming-events/repository';
import {
  upcomingEventSchema,
  validateSpeakerImage,
  validateTimeRange,
  validateUpcomingBanner,
} from '@/lib/upcoming-events/validation';
import { UpcomingEventSpeaker } from '@/lib/upcoming-events/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { eventId: string } },
) {
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

    const events = await readUpcomingEvents();
    const index = events.findIndex((item) => item.id === params.eventId);
    if (index === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const current = events[index];
    let bannerUrl = current.bannerUrl;
    let bannerStoragePath = current.bannerStoragePath;
    const banner = formData.get('banner');

    if (banner instanceof File && banner.size > 0) {
      const bannerError = validateUpcomingBanner(banner);
      if (bannerError) {
        return NextResponse.json({ error: bannerError }, { status: 400 });
      }

      const upload = await uploadEventMedia(banner, parsed.data.date, current.id);
      if (current.bannerStoragePath) {
        await deleteEventMedia(current.bannerStoragePath);
      }
      bannerUrl = upload.url;
      bannerStoragePath = upload.storagePath;
    }

    let speakersPayload: Array<{
      id?: string;
      name: string;
      designation: string;
      existingImageUrl?: string;
      existingImageStoragePath?: string;
      removeImage?: boolean;
    }> = [];
    try {
      speakersPayload = JSON.parse(String(formData.get('speakersJson') || '[]'));
    } catch {
      return NextResponse.json({ error: 'Invalid speakers payload' }, { status: 400 });
    }

    const nextSpeakers: UpcomingEventSpeaker[] = [];
    const keptStoragePaths = new Set<string>();

    for (let i = 0; i < speakersPayload.length; i += 1) {
      const payload = speakersPayload[i];
      const name = String(payload.name || '').trim();
      const designation = String(payload.designation || '').trim();
      if (!name || !designation) {
        return NextResponse.json(
          { error: `Speaker ${i + 1} name and designation are required` },
          { status: 400 },
        );
      }

      const speakerImage = formData.get(`speakerImage_${i}`);
      let imageUrl = String(payload.existingImageUrl || '');
      let imageStoragePath = String(payload.existingImageStoragePath || '');

      if (speakerImage instanceof File && speakerImage.size > 0) {
        const speakerImageError = validateSpeakerImage(speakerImage);
        if (speakerImageError) {
          return NextResponse.json({ error: speakerImageError }, { status: 400 });
        }
        const upload = await uploadEventMedia(
          speakerImage,
          parsed.data.date,
          `${current.id}-speaker-${i}`,
        );
        imageUrl = upload.url;
        imageStoragePath = upload.storagePath;
      } else if (payload.removeImage) {
        imageUrl = '';
        imageStoragePath = '';
      }

      if (!imageUrl || !imageStoragePath) {
        return NextResponse.json(
          { error: `Speaker ${i + 1} image is required` },
          { status: 400 },
        );
      }

      keptStoragePaths.add(imageStoragePath);
      nextSpeakers.push({
        id: payload.id || randomUUID(),
        name,
        designation,
        imageUrl,
        imageStoragePath,
      });
    }

    for (const existing of current.speakers || []) {
      if (existing.imageStoragePath && !keptStoragePaths.has(existing.imageStoragePath)) {
        await deleteEventMedia(existing.imageStoragePath);
      }
    }

    const updated = {
      ...current,
      ...parsed.data,
      bannerUrl,
      bannerStoragePath,
      speakers: nextSpeakers,
      updatedAt: new Date().toISOString(),
    };

    events[index] = updated;
    await writeUpcomingEvents(events);
    return NextResponse.json({ event: updated });
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
    const events = await readUpcomingEvents();
    const target = events.find((item) => item.id === params.eventId);
    if (!target) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (target.bannerStoragePath) {
      await deleteEventMedia(target.bannerStoragePath);
    }

    for (const speaker of target.speakers || []) {
      if (speaker.imageStoragePath) {
        await deleteEventMedia(speaker.imageStoragePath);
      }
    }

    await writeUpcomingEvents(events.filter((item) => item.id !== params.eventId));
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
