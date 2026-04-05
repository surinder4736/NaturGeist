import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_AUTH_COOKIE,
  createAdminAuthToken,
  isValidAdminSecret,
} from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const adminKey = String(body?.adminKey || '');

    if (!isValidAdminSecret(adminKey)) {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    const token = createAdminAuthToken(adminKey);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
