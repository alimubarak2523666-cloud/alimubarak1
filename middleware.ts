import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  // Run on every path except static assets, api, and Next internals
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
