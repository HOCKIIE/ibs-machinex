import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { getSupportedLocales } from '@/lib/locales';

const locales:string[] = getSupportedLocales()

export const routing = defineRouting({
    locales: locales,
    defaultLocale: 'th',
    localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);