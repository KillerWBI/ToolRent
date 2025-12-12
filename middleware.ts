import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/create', '/tools/new'];
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  if (!token && privateRoutes.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && authRoutes.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/create/:path*', '/auth/:path*', '/tools/new'],
};
