import { cloudinary } from '@/lib/cloudinary';

function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const httpCode =
    (error as { http_code?: number }).http_code ??
    (error as { error?: { http_code?: number } }).error?.http_code;
  return httpCode === 404;
}

function withJsonExt(publicId: string) {
  return publicId.endsWith('.json') ? publicId : `${publicId}.json`;
}

export async function uploadJson(publicId: string, data: unknown): Promise<void> {
  const buffer = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');

  await new Promise<void>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: withJsonExt(publicId),
        resource_type: 'raw',
        overwrite: true,
        invalidate: true,
      },
      (error) => {
        if (error) {
          reject(new Error(error.message || 'Cloudinary JSON upload failed'));
          return;
        }
        resolve();
      },
    );
    uploadStream.end(buffer);
  });
}

export async function readJson<T>(publicId: string, fallback: T): Promise<T> {
  try {
    const resource = await cloudinary.api.resource(withJsonExt(publicId), { resource_type: 'raw' });
    const response = await fetch(resource.secure_url, { cache: 'no-store' });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch (error) {
    if (isNotFoundError(error)) return fallback;
    throw error;
  }
}

export async function listJsonByPrefix<T>(prefix: string): Promise<{ publicId: string; data: T }[]> {
  const result = await cloudinary.api.resources({
    resource_type: 'raw',
    type: 'upload',
    prefix,
    max_results: 500,
  });

  const resources = (result.resources || []) as { public_id: string; secure_url: string }[];

  return Promise.all(
    resources.map(async (resource) => {
      const response = await fetch(resource.secure_url, { cache: 'no-store' });
      const data = (await response.json()) as T;
      return { publicId: resource.public_id, data };
    }),
  );
}

export async function deleteJson(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(withJsonExt(publicId), { resource_type: 'raw', invalidate: true });
  } catch (error) {
    if (!isNotFoundError(error)) throw error;
  }
}
