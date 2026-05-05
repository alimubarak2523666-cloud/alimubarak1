'use client';

import { useTranslations, useLocale } from 'next-intl';
import ScrollReveal from './ScrollReveal';

const CHANNEL_ID = 'UCU6B-Ujv1usqVYKGZy_43Zg';
const UPLOADS_PLAYLIST = 'UUU6B-Ujv1usqVYKGZy_43Zg';
const LATEST_VIDEO_ID = 'V5xnjOglI4A'; // latest upload — update periodically

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

          {/* Latest video with playlist context — browsable */}
          <div className="relative w-full rounded-[10px] overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${LATEST_VIDEO_ID}?list=${UPLOADS_PLAYLIST}&rel=0&modestbranding=1`}
              title="Ali Mubarak — Watch"
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

          {/* Channel page link — opens all videos */}
          <a
            href={`https://www.youtube.com/channel/${CHANNEL_ID}/videos`}
            target="_blank"
            rel="noopener noreferrer"
            className="card-lift flex items-center gap-4 bg-cream-100 border border-cream-400 rounded-card p-6 group hover:border-emerald-700"
          >
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-serif text-base text-emerald-700 font-medium mb-0.5 group-hover:text-emerald-500 transition-colors">Browse All 45 Videos →</p>
              <p className="text-xs text-ink-muted">Open the full channel on YouTube</p>
            </div>
          </a>
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
