import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Playfair_Display, Inter, Noto_Naskh_Arabic, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { locales, type Locale } from '@/i18n';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();
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
