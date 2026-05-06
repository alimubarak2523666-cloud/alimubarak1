'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import ScrollReveal from './ScrollReveal';

const VENTURES = [
  { slug: 'eva', tKey: 'eva' },
  { slug: 'koshari-bites', tKey: 'koshariBites' },
  { slug: 'amc', tKey: 'amc' },
  { slug: 'tni', tKey: 'tni' }
] as const;

export default function VenturesLanding() {
  const t = useTranslations('ventures');
  const tAbout = useTranslations('about.whatIDoToday');
  const locale = useLocale();

  const cards = [
    {
      slug: 'eva',
      title: tAbout('card1Title'),
      subtitle: tAbout('card1Subtitle'),
      meta: tAbout('card1Meta'),
      desc: tAbout('card1Desc'),
      cta: tAbout('card1Cta'),
      instagram: null as string | null
    },
    {
      slug: 'koshari-bites',
      title: tAbout('card2Title'),
      subtitle: '',
      meta: tAbout('card2Meta'),
      desc: tAbout('card2Desc'),
      cta: tAbout('card2Cta'),
      instagram: 'https://www.instagram.com/kosharibites?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' as string | null
    },
    {
      slug: 'amc',
      title: tAbout('card3Title'),
      subtitle: tAbout('card3Subtitle'),
      meta: tAbout('card3Meta'),
      desc: tAbout('card3Desc'),
      cta: tAbout('card3Cta'),
      instagram: null as string | null
    },
    {
      slug: 'tni',
      title: tAbout('card4Title'),
      subtitle: '',
      meta: tAbout('card4Meta'),
      desc: tAbout('card4Desc'),
      cta: tAbout('card4Cta'),
      instagram: null as string | null
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 page-enter">

      {/* Header */}
      <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
        <div className="gold-rule mb-4" />
        <p className="eyebrow mb-5">{t('landing.eyebrow')}</p>
        <h1
          className={`text-4xl md:text-5xl text-emerald-700 font-medium leading-[1.1] mb-4 ${
            locale === 'ar' ? 'font-serif-ar' : 'font-serif'
          }`}
        >
          {t('landing.title')}
        </h1>
        <p className="text-base text-ink leading-[1.7] max-w-xl">
          {t('landing.subtitle')}
        </p>
      </section>

      {/* Cards grid — each card lifts on hover, staggered reveal */}
      <ScrollReveal>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
          <div className="grid md:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <Link
                key={card.slug}
                href={`/${locale}/ventures/${card.slug}`}
                className="card-lift bg-cream-100 border border-cream-400 rounded-card p-7 min-h-[220px] flex flex-col hover:border-emerald-700 group"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p
                  className={`font-serif text-xl text-emerald-700 font-medium leading-tight mb-1 ${
                    locale === 'ar' ? 'font-serif-ar' : ''
                  }`}
                >
                  {card.title}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-ink-muted italic mb-3">{card.subtitle}</p>
                )}
                <p className="text-[10px] tracking-widest uppercase text-gold-400 mb-3">
                  {card.meta}
                </p>
                <p className="text-sm leading-[1.65] text-ink flex-1 mb-4">{card.desc}</p>
                <p className="text-xs text-emerald-700 font-medium group-hover:text-emerald-500 transition-colors">
                  {card.cta} →
                </p>
                {card.instagram && (
                  <a
                    href={card.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 mt-3 text-[11px] text-ink-muted hover:text-pink-600 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                    </svg>
                    @kosharibites
                  </a>
                )}
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
