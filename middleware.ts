import { NextRequest, NextResponse } from 'next/server';

const ADMIN_AUTH_COOKIE = 'ng_admin_auth';

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminLoginPath = pathname === '/admin/login';

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const expectedToken = await sha256(secret);
  const cookieToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value || '';
  const isAuthorized = cookieToken === expectedToken;

  if (!isAuthorized && !isAdminLoginPath) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthorized && isAdminLoginPath) {
    return NextResponse.redirect(new URL('/admin/events', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
