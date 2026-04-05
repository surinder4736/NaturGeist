import {
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES,
} from './constants';
import { EventMediaType } from './types';

export function detectMediaType(file: File): EventMediaType | null {
  if (SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    return 'image';
  }

  if (SUPPORTED_VIDEO_TYPES.includes(file.type as (typeof SUPPORTED_VIDEO_TYPES)[number])) {
    return 'video';
  }

  return null;
}

export function validateMediaFile(file: File): string | null {
  const type = detectMediaType(file);
  if (!type) {
    return `Unsupported format for "${file.name}".`;
  }

  if (type === 'image' && file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Image "${file.name}" exceeds 8MB limit.`;
  }

  if (type === 'video' && file.size > MAX_VIDEO_SIZE_BYTES) {
    return `Video "${file.name}" exceeds 120MB limit.`;
  }

  return null;
}
