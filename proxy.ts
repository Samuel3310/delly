import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  // If the user is trying to access /admin/login, let them pass
  if (req.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // Check for the auth cookie
  const sessionCookie = req.cookies.get('admin_session');

  if (!sessionCookie || sessionCookie.value !== 'authenticated') {
    // Redirect to the login page if not authenticated
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
