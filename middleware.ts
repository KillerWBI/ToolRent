import { NextRequest, NextResponse } from 'next/server';

// точные приватные маршруты
const PRIVATE_ROUTES = ['/profile'];          // свой профиль
// все приватные маршруты с префиксом
const PRIVATE_PREFIXES = ['/dashboard'];
// маршруты авторизации
const AUTH_PREFIXES = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // приватная страница без токена
  const isPrivate =
    PRIVATE_ROUTES.includes(pathname) ||
    PRIVATE_PREFIXES.some(prefix => pathname.startsWith(prefix));

  // страницы логина/регистрации для уже залогиненного пользователя
  const isAuthRoute = AUTH_PREFIXES.some(prefix => pathname.startsWith(prefix));

  // ❌ пользователь не залогинен → редирект на /auth/login
  if (!token && isPrivate) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // ❌ пользователь залогинен → редирект с /auth/login или /auth/register на /
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',          // свой профиль
    '/dashboard/:path*', // все приватные dashboard маршруты
    '/auth/:path*',      // страницы логина/регистрации
  ],
};
