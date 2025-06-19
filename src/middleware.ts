import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from '@/lib/authConstants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authTokenCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = authTokenCookie?.value === AUTH_COOKIE_VALUE;

  const protectedRoutes = ['/scrapbook', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    // Optionally pass the original destination for redirect after login
    // loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/scrapbook', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/scrapbook/:path*', '/admin/:path*', '/login'],
};
