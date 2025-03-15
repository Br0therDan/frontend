// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';

const locales = ['en', 'ko', 'ja'];
const defaultLocale = 'en';
const PUBLIC_FILE = /\.(.*)$/;

function getLocale(request: NextRequest) {
  // 쿠키 우선 참조
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

  // 정적 파일, API, 테스트 경로 무시
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/test') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 언어 정보가 없는 경우 getLocale 결과를 기반으로 리디렉션
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url));
  }

  // 보호된 경로 체크
  const locale = getLocale(request);
  const isProtectedRoute = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/main`) ||
      pathname.startsWith(`/${locale}/auth`) ||
      pathname.startsWith(`/${locale}/admin`)
  );
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
