import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);
const locales = process.env.NEXT_PUBLIC_LANGUAGE;
export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(th|en|ja)/:path*']
};