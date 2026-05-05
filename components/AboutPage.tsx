'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import ScrollReveal from './ScrollReveal';

// About page — 9 sections, each scroll-revealed as it enters the viewport.

function GoldRule() {
  return <div className="gold-rule mb-4" />;
}

function SectionShell({
  eyebrow,
  title,
  subtitle,
  children
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
      <GoldRule />
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h2 className="font-serif text-3xl md:text-[32px] leading-tight text-emerald-700 font-medium mb-3 max-w-2xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm leading-[1.7] text-ink-muted max-w-xl italic mb-7">{subtitle}</p>
      )}
      {children}
    </section>
  );
}

// Section 1 — Intro band
function Intro() {
  const t = useTranslations('about.intro');
  const locale = useLocale();
  return (
    <section className="bg-cream-50 border border-cream-400 rounded-[12px] overflow-hidden mb-4">
      <div className="grid md:grid-cols-[1.2fr_1fr] min-h-[360px]">
        <div className="p-9 md:p-10 flex flex-col justify-center">
          <GoldRule />
          <p className="eyebrow mb-5">{t('eyebrow')}</p>
          <h1 className={`text-4xl md:text-5xl text-emerald-700 font-medium leading-[1.05] mb-5 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
            {t('name')}
          </h1>
          <p className="text-base text-ink leading-[1.7] mb-2 max-w-md">{t('tagline')}</p>
        </div>
        <div className="bg-cream-200 flex items-center justify-center p-6">
          <div className="relative bg-emerald-700 rounded-sm w-3/4 aspect-[3/4] overflow-hidden">
            <span className="absolute inset-0 flex items-center justify-center text-gold-400 font-serif text-6xl pointer-events-none z-0">
              {locale === 'ar' ? 'ع.م' : 'AM'}
            </span>
            <Image
              src={locale === 'ar' ? '/ali-portrait-ar.jpg' : '/ali-portrait-en.jpg'}
              alt={locale === 'ar' ? 'علي عبدالله مبارك' : 'Ali Abdullah Mubarak'}
              fill
              priority
              sizes="(max-width: 768px) 70vw, 30vw"
              className="object-cover relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 2 — The Story
function TheStory() {
  const t = useTranslations('about.story');
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <div className="max-w-2xl space-y-4">
        <p className="text-[15px] leading-[1.8] text-ink">{t('paragraph1')}</p>
        <p className="text-[15px] leading-[1.8] text-ink" dangerouslySetInnerHTML={{ __html: t('paragraph2') }} />
      </div>
    </SectionShell>
  );
}

// Section 3 — What I Do Today (4 ventures)
function WhatIDoToday() {
  const t = useTranslations('about.whatIDoToday');
  const locale = useLocale();
  const cards = [
    {
      slug: 'eva',
      title: t('card1Title'),
      subtitle: t('card1Subtitle'),
      meta: t('card1Meta'),
      desc: t('card1Desc'),
      cta: t('card1Cta')
    },
    {
      slug: 'koshari-bites',
      title: t('card2Title'),
      subtitle: '',
      meta: t('card2Meta'),
      desc: t('card2Desc'),
      cta: t('card2Cta')
    },
    {
      slug: 'amc',
      title: t('card3Title'),
      subtitle: t('card3Subtitle'),
      meta: t('card3Meta'),
      desc: t('card3Desc'),
      cta: t('card3Cta')
    },
    {
      slug: 'tni',
      title: t('card4Title'),
      subtitle: '',
      meta: t('card4Meta'),
      desc: t('card4Desc'),
      cta: t('card4Cta')
    }
  ];
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <div className="grid md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.slug}
            href={`/${locale}/ventures/${card.slug}`}
            className="card-lift bg-cream-100 border border-cream-400 rounded-card p-6 min-h-[200px] flex flex-col hover:border-emerald-700 group"
          >
            <p className={`font-serif text-xl text-emerald-700 font-medium leading-tight mb-1 ${locale === 'ar' ? 'font-serif-ar' : ''}`}>{card.title}</p>
            {card.subtitle && (
              <p className="text-xs text-ink-muted italic mb-3">{card.subtitle}</p>
            )}
            <p className="text-[10px] tracking-widest uppercase text-gold-400 mb-3">{card.meta}</p>
            <p className="text-sm leading-[1.65] text-ink flex-1 mb-4">{card.desc}</p>
            <p className="text-xs text-emerald-700 font-medium group-hover:text-emerald-500">{card.cta}</p>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

// Section 4 — Public Service
function PublicService() {
  const t = useTranslations('about.publicService');
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <p className="eyebrow mb-3">{t('committeesLabel')}</p>
      <div className="border-t border-cream-400">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="py-4 border-b border-cream-400 last:border-b-0">
            <p className="font-serif text-[17px] text-emerald-700 font-medium mb-1">{t(`committee${n}Title`)}</p>
            <p className="text-[13.5px] leading-[1.6] text-ink">{t(`committee${n}Body`)}</p>
          </div>
        ))}
      </div>
      <p className="eyebrow mt-8 mb-3">{t('awardLabel')}</p>
      <div className="border-t border-cream-400 py-4">
        <p className="font-serif text-[17px] text-emerald-700 font-medium mb-1">{t('awardTitle')}</p>
        <p className="text-[13.5px] leading-[1.6] text-ink">{t('awardBody')}</p>
      </div>
    </SectionShell>
  );
}

// Section 5 — Career Journey
function CareerJourney() {
  const t = useTranslations('about.career');
  const roles = [1, 2, 3, 4, 5] as const;
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')}>
      <div className="border-t border-cream-400">
        {roles.map((n) => (
          <div key={n} className="grid grid-cols-[120px_1fr] gap-5 py-4 border-b border-cream-400 last:border-b-0">
            <p className="text-[11px] tracking-widest uppercase text-gold-400 pt-1">{t(`role${n}Years`)}</p>
            <div>
              <p className="font-serif text-[17px] text-emerald-700 font-medium mb-1">{t(`role${n}Title`)}</p>
              <p className="text-[13.5px] leading-[1.6] text-ink">{t(`role${n}Body`)}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

// Section 6 — Education
function Education() {
  const t = useTranslations('about.education');
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2].map((n) => (
          <div key={n} className="bg-cream-100 border border-cream-400 rounded-card p-6">
            <p className="text-[10px] tracking-widest uppercase text-gold-400 mb-2">{t(`school${n}Year`)}</p>
            <p className="font-serif text-xl text-emerald-700 font-medium mb-1">{t(`school${n}Degree`)}</p>
            <p className="text-sm text-ink mb-2">{t(`school${n}Name`)}</p>
            <p className="text-[13px] leading-[1.6] text-ink-muted italic">{t(`school${n}Detail`)}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

// Section 7 — Writing & Voice
function WritingAndVoice() {
  const t = useTranslations('about.writing');
  const locale = useLocale();
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <p className="text-[15px] leading-[1.8] text-ink mb-7 max-w-2xl">{t('body')}</p>
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-cream-100 border border-cream-400 rounded-card p-5">
            <p className="text-[10px] tracking-widest uppercase text-gold-400 mb-2">{t(`item${n}Eyebrow`)}</p>
            <p className="font-serif text-base text-emerald-700 font-medium mb-1">{t(`item${n}Title`)}</p>
            <p className="text-[13px] leading-[1.6] text-ink">{t(`item${n}Body`)}</p>
          </div>
        ))}
      </div>
      <Link href={`/${locale}/book`} className="inline-block mt-7 text-xs text-emerald-700 font-medium hover:text-emerald-500">
        {t('cta')}
      </Link>
    </SectionShell>
  );
}

// Section 8 — Recognitions
function Recognitions() {
  const t = useTranslations('about.recognitions');
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="border-l-2 border-gold-400 ps-5 py-1">
            <p className="font-serif text-[15px] text-emerald-700 font-medium mb-1">{t(`item${n}Title`)}</p>
            <p className="text-[13px] leading-[1.6] text-ink">{t(`item${n}Body`)}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

// Section 9 — Closing CTA
function ClosingCta() {
  const t = useTranslations('about.closing');
  const locale = useLocale();
  return (
    <section className="bg-emerald-700 rounded-[12px] p-10 md:p-14 text-center mb-4">
      <div className="w-10 h-px bg-gold-400 mx-auto mb-4" />
      <h2 className="font-serif text-3xl md:text-4xl text-cream-50 font-medium leading-tight mb-4 max-w-xl mx-auto">
        {t('title')}
      </h2>
      <p className="text-sm leading-[1.75] text-cream-200/90 max-w-md mx-auto mb-7">{t('body')}</p>
      <Link
        href={`/${locale}/work-with-ali`}
        className="inline-block bg-gold-400 text-cream-50 border border-gold-400 rounded-md px-6 py-3 text-sm font-medium hover:bg-gold-600 transition-colors"
      >
        {t('cta')}
      </Link>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 page-enter">
      <Intro />
      <ScrollReveal delay={0}>   <TheStory />       </ScrollReveal>
      <ScrollReveal delay={0}>   <WhatIDoToday />   </ScrollReveal>
      <ScrollReveal delay={0}>   <PublicService />  </ScrollReveal>
      <ScrollReveal delay={0}>   <CareerJourney />  </ScrollReveal>
      <ScrollReveal delay={0}>   <Education />      </ScrollReveal>
      <ScrollReveal delay={0}>   <WritingAndVoice /></ScrollReveal>
      <ScrollReveal delay={0}>   <Recognitions />   </ScrollReveal>
      <ScrollReveal delay={0}>   <ClosingCta />     </ScrollReveal>
    </div>
  );
}
