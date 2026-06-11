import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intl = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // THE EDIT preview: the store is the landing page (302 = reversible)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/store/', req.url), 302);
  }

  return intl(req);
}

export const config = {
  // Run on every path except static assets, api, the store, and Next internals
  matcher: ['/((?!api|_next|store|.*\\..*).*)']
};
