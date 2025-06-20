
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_auth';
const ADMIN_COOKIE_VALUE = 'admin_is_authenticated';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect every /admin/* route (dashboard, videos, future pages)
  if (pathname.startsWith('/admin')) {
    const adminCookie = cookies().get(ADMIN_COOKIE_NAME);
    if (!adminCookie || adminCookie.value !== ADMIN_COOKIE_VALUE) {
      // Redirect to login page, admin can login via AdminIcon there
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Specify paths for the middleware to run on
export const config = {
  // Run on any route under /admin/
  matcher: ['/admin/:path*'],
};
