import { randomUUID } from 'crypto';
import { cloudinary } from '@/lib/cloudinary';

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, '-');
}

function buildPublicId(eventDate: string, eventId: string) {
  return `naturgeist/events/${sanitizeSegment(eventDate)}/${sanitizeSegment(eventId)}-${randomUUID()}`;
}

function detectResourceType(file: File): 'image' | 'video' {
  return file.type.startsWith('video/') ? 'video' : 'image';
}

export async function uploadEventMedia(file: File, eventDate: string, eventId: string) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const publicId = buildPublicId(eventDate, eventId);
  const resourceType = detectResourceType(file);

  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: resourceType,
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(new Error(error?.message || 'Cloudinary upload failed'));
          return;
        }
        resolve(uploadResult);
      },
    );
    uploadStream.end(fileBuffer);
  });

  return {
    url: result.secure_url,
    storagePath: result.public_id,
  };
}

export async function deleteEventMedia(storagePath: string, resourceType: 'image' | 'video' = 'image') {
  await cloudinary.uploader.destroy(storagePath, { resource_type: resourceType });
}
