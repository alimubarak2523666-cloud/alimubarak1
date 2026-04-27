'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

// Homepage hero. Locked composition per memory:
//   Two-column layout, ~360px tall on desktop, stacks on mobile.
//   Left (LTR) / right (RTL): gold rule + uppercase gold eyebrow + serif name + tagline + 2 CTAs.
//   Other column: sand cream background containing emerald photo block holding the portrait.
//   English uses ali-portrait-formal-en.jpg, Arabic uses ali-portrait-warm-ar.jpg.

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  // Photo bound to language — different facet of Ali for each audience
  const photoSrc =
    locale === 'ar' ? '/ali-portrait-warm-ar.jpg' : '/ali-portrait-formal-en.jpg';
  const photoAlt =
    locale === 'ar'
      ? 'علي عبدالله مبارك — صورة شخصية'
      : 'Ali Abdullah Mubarak — portrait';

  return (
    <section className="bg-cream-50">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center min-h-[420px]">
          <div className="flex flex-col justify-center">
            <div className="gold-rule mb-4" />
            <p className="eyebrow mb-5">{t('eyebrow')}</p>
            <h1
              className={`text-4xl md:text-5xl text-emerald-700 font-medium leading-[1.05] mb-5 ${
                locale === 'ar' ? 'font-serif-ar' : 'font-serif'
              }`}
            >
              {t('name')}
            </h1>
            <p className="text-base text-ink leading-[1.7] mb-7 max-w-md">
              {t('tagline')}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href={`/${locale}/work-with-ali`}
                className="bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-500 transition-colors"
              >
                {t('primaryCta')}
              </Link>
              <Link
                href={`/${locale}/book`}
                className="bg-transparent text-emerald-700 border border-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-700 hover:text-cream-50 transition-colors"
              >
                {t('secondaryCta')}
              </Link>
            </div>
          </div>

          <div className="bg-cream-200 rounded p-6 flex items-center justify-center">
            <div
              className="bg-emerald-700 rounded-sm w-3/4 aspect-[3/4] flex items-center justify-center text-gold-400 font-serif text-6xl relative overflow-hidden"
              aria-hidden={false}
            >
              {/*
                Once the actual portrait files are dropped at /public/ali-portrait-*.jpg,
                the <Image> below replaces the placeholder initials.
                Until then, "AM" / "ع.م" stand in.
              */}
              {/* Image is rendered AFTER the placeholder span so when the
                  image is missing or fails to load, the gold "AM" / "ع.م" behind it
                  is visible. Once the actual portrait file lands at /public/, it
                  paints on top of the placeholder. */}
              <span className="absolute pointer-events-none z-0">
                {locale === 'ar' ? 'ع.م' : 'AM'}
              </span>
              <Image
                src={photoSrc}
                alt={photoAlt}
                fill
                priority
                sizes="(max-width: 768px) 80vw, 30vw"
                className="object-cover relative z-10"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-cream-400 mt-12 pt-4 flex items-center justify-between text-xs text-ink-muted">
          <p className="font-serif italic">{t('footerStrip')}</p>
        </div>
      </div>
    </section>
  );
}
