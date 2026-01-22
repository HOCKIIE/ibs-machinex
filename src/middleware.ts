import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔒 อย่าให้ next-intl จับไฟล์ระบบ
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return;
  }

  return createMiddleware(routing)(req);
}

export const config = {
  matcher: [
    '/',
    '/(th|en|ja)/:path*'
  ]
};