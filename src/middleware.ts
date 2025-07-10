import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
// import config from '../next-intl.config'

export default createMiddleware(routing);

export const configMatcher  = {
    // Match only internationalized pathnames
    matcher: ['/', '/(th|en|ja)/:path*']
};