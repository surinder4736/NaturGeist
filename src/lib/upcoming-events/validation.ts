import { z } from 'zod';

export const upcomingEventSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be HH:MM'),
  location: z.string().trim().min(2, 'Location is required'),
  actionLink: z.string().trim().url('Action link must be a valid URL').or(z.literal('')),
  status: z.enum(['ACTIVE', 'DRAFT', 'CANCELLED']),
});

export function validateUpcomingBanner(file: File) {
  if (!file || file.size === 0) {
    return 'Banner image is required';
  }

  if (!file.type.startsWith('image/')) {
    return 'Banner must be an image file';
  }

  if (file.size > 8 * 1024 * 1024) {
    return 'Banner exceeds 8MB size limit';
  }

  return '';
}

export function validateSpeakerImage(file: File) {
  if (!file.type.startsWith('image/')) {
    return 'Speaker image must be an image file';
  }

  if (file.size > 5 * 1024 * 1024) {
    return 'Speaker image exceeds 5MB size limit';
  }

  return '';
}

export function validateTimeRange(startTime: string, endTime: string) {
  const start = new Date(`2000-01-01T${startTime}`).getTime();
  const end = new Date(`2000-01-01T${endTime}`).getTime();
  return end > start;
}

export function isFutureEvent(date: string, startTime: string) {
  return new Date(`${date}T${startTime || '00:00'}`).getTime() >= Date.now();
}
