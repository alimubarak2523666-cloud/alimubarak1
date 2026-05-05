'use client';

import { useTranslations, useLocale } from 'next-intl';
import ScrollReveal from './ScrollReveal';
import type { VideoItem } from '@/app/[locale]/youtube/page';

const CHANNEL_ID = 'UCU6B-Ujv1usqVYKGZy_43Zg';
const CHANNEL_HANDLE = '@amubarak1';

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function formatDate(iso: string, locale: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(
      locale === 'ar' ? 'ar-KW' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  } catch {
    return '';
  }
}

interface Props {
  videos?: VideoItem[];
}

export default function YouTubePage({ videos = [] }: Props) {
  const t = useTranslations('youtube');
  const locale = useLocale();

  const links = [
    {
      href: `https://www.youtube.com/channel/${CHANNEL_ID}/videos`,
      label: locale === 'ar' ? 'كل الحلقات' : 'All Episodes',
      sub: locale === 'ar' ? '45 مقطع · أحدث التحميلات' : '45 videos · latest uploads',
    },
    {
      href: `https://www.youtube.com/channel/${CHANNEL_ID}/streams`,
      label: locale === 'ar' ? 'جلسات البث المباشر' : 'Live Sessions',
      sub: locale === 'ar' ? 'بث مباشر وأرشيف الجلسات' : 'Live broadcasts & replays',
    },
    {
      href: `https://www.youtube.com/channel/${CHANNEL_ID}?sub_confirmation=1`,
      label: locale === 'ar' ? 'اشترك في القناة' : 'Subscribe',
      sub: locale === 'ar' ? 'لا تفوّت أي حلقة جديدة' : 'Get notified of every new episode',
    },
  ];

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

      {/* Hero channel card */}
      <ScrollReveal>
        <section className="mb-4">
          <a
            href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block bg-emerald-700 rounded-[12px] overflow-hidden"
          >
            {/* Background texture */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)'
              }}
            />

            <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* YouTube logo */}
              <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <YoutubeIcon className="w-10 h-10 text-white" />
              </div>

              <div className="flex-1">
                <p className="text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-2">
                  {t('channelLabel')}
                </p>
                <h2 className={`text-2xl md:text-3xl text-cream-50 font-medium leading-tight mb-1 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
                  {t('channelName')}
                </h2>
                <p className="text-sm text-cream-200/70 mb-0">{CHANNEL_HANDLE} · {t('channelStats')}</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-cream-50/20 text-cream-50/60 group-hover:border-gold-400 group-hover:text-gold-400 transition-colors duration-300 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </a>
        </section>
      </ScrollReveal>

      {/* Latest videos thumbnail grid */}
      {videos.length > 0 && (
        <ScrollReveal delay={40}>
          <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
            <div className="gold-rule mb-4" />
            <p className="eyebrow mb-5">
              {locale === 'ar' ? 'أحدث الحلقات' : 'Latest Episodes'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video, i) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-[10px] overflow-hidden border border-cream-400 hover:border-emerald-700 transition-colors duration-200 bg-cream-100 card-lift"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-cream-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Dark overlay + play button on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <PlayIcon />
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="p-4">
                    <p className="text-sm text-emerald-700 font-medium leading-[1.5] line-clamp-2 group-hover:text-emerald-500 transition-colors duration-200">
                      {video.title}
                    </p>
                    {video.published && (
                      <p className="text-[11px] text-ink-muted mt-1.5">
                        {formatDate(video.published, locale)}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Quick links grid */}
      <ScrollReveal delay={50}>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
          <div className="gold-rule mb-4" />
          <p className="eyebrow mb-5">{locale === 'ar' ? 'اختر ما تريد مشاهدته' : 'Jump to'}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift bg-cream-100 border border-cream-400 rounded-card p-6 flex flex-col group hover:border-emerald-700"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                  <YoutubeIcon className="w-4 h-4 text-cream-50" />
                </div>
                <p className="font-serif text-base text-emerald-700 font-medium mb-1 group-hover:text-emerald-500 transition-colors">
                  {link.label} →
                </p>
                <p className="text-xs text-ink-muted leading-[1.6]">{link.sub}</p>
              </a>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Live badge info */}
      <ScrollReveal delay={70}>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <p className="text-[10px] tracking-[0.25em] uppercase text-red-500 font-medium">{t('liveBadge')}</p>
          </div>
          <h2 className={`text-2xl md:text-3xl text-emerald-700 font-medium leading-tight mb-3 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
            {t('liveTitle')}
          </h2>
          <p className="text-sm text-ink leading-[1.7] max-w-xl mb-6">{t('liveDesc')}</p>
          <a
            href={`https://www.youtube.com/channel/${CHANNEL_ID}/streams`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block border border-emerald-700 text-emerald-700 rounded-md px-6 py-3 text-sm font-medium hover:bg-emerald-700 hover:text-cream-50 transition-colors"
          >
            {t('liveButton')}
          </a>
          <p className="text-xs text-ink-muted mt-4 leading-[1.6]">{t('liveNote')}</p>
        </section>
      </ScrollReveal>

      {/* Subscribe CTA */}
      <ScrollReveal delay={90}>
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
