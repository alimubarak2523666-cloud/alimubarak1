'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

// Homepage hero — Apple-style staggered entrance on load.
// Each element animates in sequentially via CSS keyframes (heroFadeUp / heroPhoto).
// Locked composition: two-column, text left, portrait right.
// Gold rule grows in first, then eyebrow → name → tagline → CTAs.
// Photo scales down from 1.05 → 1.0 with a fade.

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  const photoSrc =
    locale === 'ar' ? '/ali-portrait-ar.jpg' : '/ali-portrait-en.jpg';
  const photoAlt =
    locale === 'ar'
      ? 'علي عبدالله مبارك — صورة شخصية'
      : 'Ali Abdullah Mubarak — portrait';

  return (
    <section className="bg-cream-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-24">
        {/* Mobile: 2 col [text | compact photo] — both visible above fold.
            Desktop: 2 col [1.2fr | 1fr] — full portrait. */}
        <div className="grid grid-cols-[1fr_130px] md:grid-cols-[1.2fr_1fr] gap-5 md:gap-16 items-center md:min-h-[460px]">

          {/* ── Text column ─────────────────────────── */}
          <div className="flex flex-col justify-center">
            {/* Gold rule grows in — self-start keeps it at text-start in both LTR and RTL */}
            <div className="gold-rule mb-3 md:mb-4 hero-rule self-start" />

            {/* Eyebrow */}
            <p className="eyebrow mb-3 md:mb-5 hero-item-1">
              {t('eyebrow')}
            </p>

            {/* Name */}
            <h1
              className={`text-3xl md:text-5xl lg:text-6xl text-emerald-700 font-medium leading-[1.05] mb-3 md:mb-5 hero-item-2 ${
                locale === 'ar' ? 'font-serif-ar' : 'font-serif'
              }`}
            >
              {t('name')}
            </h1>

            {/* Tagline */}
            <p className="text-sm md:text-lg text-ink leading-[1.6] md:leading-[1.75] mb-5 md:mb-8 max-w-md hero-item-3">
              {t('tagline')}
            </p>

            {/* CTAs */}
            <div className="flex gap-2 md:gap-3 flex-wrap hero-item-4">
              <Link
                href={`/${locale}/work-with-ali`}
                className="btn-primary bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium hover:bg-emerald-500"
              >
                {t('primaryCta')}
              </Link>
              <Link
                href={`/${locale}/book`}
                className="btn-primary bg-transparent text-emerald-700 border border-emerald-700 rounded-md px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium hover:bg-emerald-700 hover:text-cream-50"
              >
                {t('secondaryCta')}
              </Link>
            </div>
          </div>

          {/* ── Photo column ─────────────────────────── */}
          <div className="bg-cream-200 rounded-xl p-2 md:p-6 flex items-center justify-center hero-photo">
            <div
              className="bg-emerald-700 rounded-sm w-full md:w-3/4 aspect-[3/4] flex items-center justify-center text-gold-400 font-serif text-6xl relative overflow-hidden"
              aria-hidden={false}
            >
              <span className="absolute pointer-events-none z-0 text-2xl md:text-6xl">
                {locale === 'ar' ? 'ع.م' : 'AM'}
              </span>
              <Image
                src={photoSrc}
                alt={photoAlt}
                fill
                priority
                sizes="(max-width: 768px) 130px, 30vw"
                className="object-cover relative z-10"
              />
            </div>
          </div>
        </div>

        {/* Strip */}
        <div className="border-t border-cream-400 mt-8 md:mt-14 pt-4 flex items-center justify-between text-xs text-ink-muted hero-item-4">
          <p className="font-serif italic">{t('footerStrip')}</p>
        </div>
      </div>
    </section>
  );
}
