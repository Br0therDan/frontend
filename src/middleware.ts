// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';

const locales = ['en', 'ko', 'ja'];
const defaultLocale = 'en';
const PUBLIC_FILE = /\.(.*)$/;

function getLocale(request: NextRequest) {
  // ✅ 쿠키 우선 참조
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 쿠키 없으면 헤더 참조
  const negotiatorHeaders = {
    'accept-language': request.headers.get('accept-language') || defaultLocale,
  };
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return languages.find((lang: string) => locales.includes(lang)) || defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/test') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some((locale) =>
    pathname.startsWith(`/${locale}`),
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url),
    );
  }

  // 보호된 경로 체크 예시
  const locale = getLocale(request);
  const isProtectedRoute = pathname.startsWith(`/${locale}/main`);
  if (isProtectedRoute && !request.cookies.get('access_token')) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)',
    '/[locale]/main/:path*',
    '/[locale]/auth/:path*',
    '/[locale]/docs/:path*',
  ],
};
