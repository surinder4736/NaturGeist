import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

function fileExtFromName(fileName: string) {
  const ext = path.extname(fileName || '').replace('.', '').toLowerCase();
  return ext || 'bin';
}

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, '-');
}

function buildStoragePath(eventDate: string, eventId: string, fileName: string) {
  const dateFolder = eventDate;
  const ext = fileExtFromName(fileName);
  return `events/${sanitizeSegment(dateFolder)}/${sanitizeSegment(eventId)}/${randomUUID()}.${ext}`;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET;

function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey && supabaseBucket);
}

async function uploadToSupabase(file: File, storagePath: string) {
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${storagePath}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      apikey: String(supabaseServiceRoleKey),
      'x-upsert': 'true',
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: fileBuffer,
  });

  if (!uploadResponse.ok) {
    const errorBody = await uploadResponse.text();
    throw new Error(`Bucket upload failed: ${errorBody}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${storagePath}`;
}

async function deleteFromSupabase(storagePath: string) {
  const deleteUrl = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${storagePath}`;
  await fetch(deleteUrl, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      apikey: String(supabaseServiceRoleKey),
    },
  });
}

async function uploadToLocalPublic(file: File, storagePath: string) {
  const outputPath = path.join(process.cwd(), 'public', 'uploads', storagePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  await writeFile(outputPath, fileBuffer);

  return `/uploads/${storagePath}`;
}

async function deleteFromLocalPublic(storagePath: string) {
  const outputPath = path.join(process.cwd(), 'public', 'uploads', storagePath);
  try {
    await unlink(outputPath);
  } catch {
    // Ignore missing local files.
  }
}

export async function uploadEventMedia(file: File, eventDate: string, eventId: string) {
  const storagePath = buildStoragePath(eventDate, eventId, file.name);
  const url = isSupabaseConfigured()
    ? await uploadToSupabase(file, storagePath)
    : await uploadToLocalPublic(file, storagePath);

  return {
    url,
    storagePath,
  };
}

export async function deleteEventMedia(storagePath: string) {
  if (isSupabaseConfigured()) {
    await deleteFromSupabase(storagePath);
    return;
  }

  await deleteFromLocalPublic(storagePath);
}
