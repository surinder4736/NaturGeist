import { createHash, timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';

export const ADMIN_AUTH_COOKIE = 'ng_admin_auth';

function getAdminSecret() {
  const secret = process.env.ADMIN_SECRET_KEY || 'admin@123';
  return secret;
}

export function createAdminAuthToken(secretKey: string) {
  return createHash('sha256').update(secretKey).digest('hex');
}

export function expectedAdminAuthToken() {
  return createAdminAuthToken(getAdminSecret());
}

export function isValidAdminSecret(input: string) {
  const expected = Buffer.from(getAdminSecret());
  const provided = Buffer.from(input || '');
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}

export function isAdminRequest(request: NextRequest) {
  const cookieToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value || '';
  const headerSecret = request.headers.get('x-admin-key') || '';
  const expectedToken = expectedAdminAuthToken();

  if (cookieToken && cookieToken === expectedToken) {
    return true;
  }

  if (headerSecret && isValidAdminSecret(headerSecret)) {
    return true;
  }

  return false;
}
