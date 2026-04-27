import { unstable_setRequestLocale } from 'next-intl/server';
import Hero from '@/components/Hero';
import type { Locale } from '@/i18n';

export default function HomePage({
  params: { locale }
}: {
  params: { locale: Locale };
}) {
  unstable_setRequestLocale(locale);
  return (
    <>
      <Hero />
    </>
  );
}
