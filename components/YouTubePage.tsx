'use client';

import { useTranslations, useLocale } from 'next-intl';
import ScrollReveal from './ScrollReveal';

const CHANNEL_ID = 'UCU6B-Ujv1usqVYKGZy_43Zg';
const UPLOADS_PLAYLIST = 'UUU6B-Ujv1usqVYKGZy_43Zg';

export default function YouTubePage() {
  const t = useTranslations('youtube');
  const locale = useLocale();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 page-enter">

      {/* Header */}
      <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
        <div className="gold-rule mb-4" />
        <p className="eyebrow mb-5">{t('eyebrow')}</p>
        <h1
          className={`text-4xl md:text-5xl text-emerald-700 font-medium leading-[1.1] mb-4 ${
            locale === 'ar' ? 'font-serif-ar' : 'font-serif'
          }`}
        >
          {t('title')}
        </h1>
        <p className="text-base text-ink leading-[1.7] max-w-2xl">{t('subtitle')}</p>
      </section>

      {/* Live Stream embed */}
      <ScrollReveal>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
          {/* Live badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <p className="text-[10px] tracking-[0.25em] uppercase text-red-500 font-medium">
              {t('liveBadge')}
            </p>
          </div>

          <h2
            className={`text-2xl md:text-3xl text-emerald-700 font-medium leading-tight mb-2 ${
              locale === 'ar' ? 'font-serif-ar' : 'font-serif'
            }`}
          >
            {t('liveTitle')}
          </h2>
          <p className="text-sm text-ink leading-[1.7] mb-6 max-w-xl">{t('liveDesc')}</p>

          {/* YouTube live stream iframe */}
          <div className="relative w-full rounded-[10px] overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=0&rel=0&modestbranding=1`}
              title="Ali Mubarak — Live"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          <p className="text-xs text-ink-muted mt-3 leading-[1.6]">{t('liveNote')}</p>
        </section>
      </ScrollReveal>

      {/* Latest Videos */}
      <ScrollReveal delay={60}>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
          <div className="gold-rule mb-4" />
          <p className="eyebrow mb-5">{locale === 'ar' ? 'أحدث المقاطع' : 'Latest Videos'}</p>
          <h2
            className={`text-2xl md:text-3xl text-emerald-700 font-medium leading-tight mb-2 ${
              locale === 'ar' ? 'font-serif-ar' : 'font-serif'
            }`}
          >
            {t('latestTitle')}
          </h2>
          <p className="text-sm text-ink leading-[1.7] mb-6 max-w-xl">{t('latestDesc')}</p>

          {/* Uploads playlist */}
          <div className="relative w-full rounded-[10px] overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/videoseries?list=${UPLOADS_PLAYLIST}&rel=0&modestbranding=1`}
              title="Ali Mubarak — Latest Videos"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </section>
      </ScrollReveal>

      {/* CTA — subscribe */}
      <ScrollReveal delay={80}>
        <section className="bg-emerald-700 rounded-[12px] p-10 md:p-14">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-4">
            {t('ctaEyebrow')}
          </p>
          <h2
            className={`text-2xl md:text-3xl text-cream-50 font-medium leading-tight mb-4 max-w-xl ${
              locale === 'ar' ? 'font-serif-ar' : 'font-serif'
            }`}
          >
            {t('ctaTitle')}
          </h2>
          <a
            href={`https://www.youtube.com/channel/${CHANNEL_ID}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block bg-gold-400 text-cream-50 border border-gold-400 rounded-md px-6 py-3 text-sm font-medium hover:bg-gold-600 transition-colors"
          >
            {t('ctaButton')}
          </a>
        </section>
      </ScrollReveal>

    </div>
  );
}
