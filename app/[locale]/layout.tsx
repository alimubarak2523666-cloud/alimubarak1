import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Playfair_Display, Inter, Noto_Naskh_Arabic, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { locales, type Locale } from '@/i18n';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// Render every locale route per request — both to bypass static-gen issues
// AND because next-intl 3.x's server cache triggers a WeakMap bug when
// Netlify's Next.js runtime tries to memoize locale messages.
export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-playfair',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap'
});

const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-naskh',
  display: 'swap'
});

const plexAr = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-ar',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Ali Mubarak — Engineer · Entrepreneur · Strategic Advisor · Author',
    template: '%s · Ali Mubarak'
  },
  description:
    'I build companies, advise executives, and bridge government and private sector across Kuwait and the GCC.',
  metadataBase: new URL('https://alimubarak1.com')
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!locales.includes(locale)) notFound();

  // Load messages by direct dynamic import. We deliberately skip
  // next-intl's getMessages() server helper because it runs through a
  // React.cache() WeakMap that crashes on Netlify's Next.js runtime.
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${playfair.variable} ${inter.variable} ${naskh.variable} ${plexAr.variable}`}
    >
      <body className="bg-cream-50 text-ink min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
