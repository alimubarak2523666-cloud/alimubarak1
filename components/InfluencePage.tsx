'use client';

import { useTranslations, useLocale } from 'next-intl';
import ScrollReveal from './ScrollReveal';

export default function InfluencePage() {
  const t = useTranslations('influence');
  const locale = useLocale();

  const cards = [
    { titleKey: 'podcastTitle', descKey: 'podcastDesc' },
    { titleKey: 'tvTitle', descKey: 'tvDesc' },
    { titleKey: 'youtubeTitle', descKey: 'youtubeDesc' },
    { titleKey: 'socialTitle', descKey: 'socialDesc' },
    { titleKey: 'partnershipsTitle', descKey: 'partnershipsDesc' }
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 page-enter">

      {/* Header */}
      <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
        <div className="gold-rule mb-4" />
        <p className="eyebrow mb-5">{t('eyebrow')}</p>
        <h1 className={`text-4xl md:text-5xl text-emerald-700 font-medium leading-[1.1] mb-4 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
          {t('title')}
        </h1>
        <p className="text-base text-ink leading-[1.7] max-w-2xl">{t('subtitle')}</p>
      </section>

      {/* Media cards — staggered reveal */}
      <ScrollReveal>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
          <div className="grid md:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <div
                key={card.titleKey}
                className="card-lift bg-cream-100 border border-cream-400 rounded-card p-6"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p className={`font-serif text-xl text-emerald-700 font-medium mb-3 leading-tight ${locale === 'ar' ? 'font-serif-ar' : ''}`}>
                  {t(card.titleKey)}
                </p>
                <p className="text-sm leading-[1.7] text-ink">{t(card.descKey)}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* BoutiqaT banner */}
      <ScrollReveal delay={60}>
        <section className="bg-emerald-700 rounded-[12px] p-10 md:p-14 mb-4">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-4">
            {t('boutiqatTitle')}
          </p>
          <h2 className={`text-2xl md:text-3xl text-cream-50 font-medium leading-tight mb-4 max-w-xl ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
            {t('boutiqatDesc')}
          </h2>
          <a
            href="https://boutiqaat.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block bg-gold-400 text-cream-50 border border-gold-400 rounded-md px-6 py-3 text-sm font-medium hover:bg-gold-600"
          >
            {t('boutiqatCta')}
          </a>
        </section>
      </ScrollReveal>

      {/* Social links */}
      <ScrollReveal delay={80}>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12">
          <p className="eyebrow mb-4">{locale === 'ar' ? 'ابحث عني هنا' : 'Find me here'}</p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="https://instagram.com/alimubarak1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary border border-emerald-700 text-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-700 hover:text-cream-50 transition-colors"
            >
              {t('instagramCta')}
            </a>
            <a
              href="https://x.com/alimubarak_1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary border border-emerald-700 text-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-700 hover:text-cream-50 transition-colors"
            >
              {t('xCta')}
            </a>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
