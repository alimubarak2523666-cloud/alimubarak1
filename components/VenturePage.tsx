'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

// One generic venture detail page. Receives a tKey ('eva' | 'koshariBites' | 'amc' | 'tni')
// and pulls its title/subtitle/lead/comingSoon copy from messages.
export default function VenturePage({
  tKey
}: {
  tKey: 'eva' | 'koshariBites' | 'amc' | 'tni';
}) {
  const t = useTranslations(`ventures.${tKey}`);
  const locale = useLocale();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <Link
        href={`/${locale}/ventures`}
        className="text-xs text-ink-muted hover:text-emerald-700 mb-6 inline-block"
      >
        {locale === 'ar' ? '← كل المشاريع' : '← All ventures'}
      </Link>

      <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-14 mb-4">
        <div className="gold-rule mb-4" />
        <p className="eyebrow mb-4">{locale === 'ar' ? 'مشروع' : 'Venture'}</p>
        <h1 className={`text-3xl md:text-[42px] text-emerald-700 font-medium leading-[1.1] mb-3 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
          {t('title')}
        </h1>
        <p className="text-sm text-ink-muted italic mb-8 max-w-2xl">{t('subtitle')}</p>
        <p className="text-[15px] leading-[1.85] text-ink max-w-2xl mb-8">{t('lead')}</p>

        <div className="border-s-2 border-gold-400 ps-6 max-w-2xl">
          <p className="text-[14px] leading-[1.75] text-ink-muted italic">{t('comingSoon')}</p>
        </div>
      </section>

      <section className="bg-emerald-700 rounded-[12px] p-10 md:p-12 text-center">
        <p className="font-serif text-2xl text-cream-50 font-medium mb-3">
          {locale === 'ar' ? 'تواصل مباشر' : 'Direct contact'}
        </p>
        <p className="text-sm leading-[1.7] text-cream-200/90 mb-6 max-w-md mx-auto">
          {locale === 'ar'
            ? 'لكل ما يخص هذا المشروع، تواصل مع المكتب مباشرةً.'
            : "For anything related to this venture, reach the office directly."}
        </p>
        <a
          href="mailto:ali@alimubarak1.com"
          className="inline-block bg-gold-400 text-cream-50 border border-gold-400 rounded-md px-6 py-3 text-sm font-medium hover:bg-gold-600 transition-colors"
        >
          ali@alimubarak1.com →
        </a>
      </section>
    </div>
  );
}
