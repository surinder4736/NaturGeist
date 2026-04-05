export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
export const MAX_VIDEO_SIZE_BYTES = 120 * 1024 * 1024;

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
] as const;

export const ADMIN_HEADER_NAME = 'x-admin-key';
