import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const hostname = req.nextUrl.hostname

    // 🔒 อย่าให้ next-intl จับไฟล์ระบบ
    if (
        pathname === '/sitemap.xml' ||
        pathname === '/robots.txt'
    ) {
        return;
    }

    const response = intlMiddleware(req);

    // 🔥 remove :3000
    const location = response?.headers.get('location');

    if (location && hostname !== 'localhost') {
        response.headers.set(
            'location',
            location.replace(':3000', '')
        );
    }

    return response;
}

export const config = {
    matcher: [
        '/',
        '/(th|en|ja)/:path*'
    ]
};