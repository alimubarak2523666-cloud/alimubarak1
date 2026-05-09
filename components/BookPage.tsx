/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

// Locked TOC data — 12 chapters with bilingual titles, descriptions, and page counts.
// Eastern Arabic-Indic numerals used for the Arabic version per locked design tokens.
const TOC = {
  en: [
    { num: '01', title: 'Why Marriage, Not Merger', desc: 'On metaphors that shape national strategy', pages: '22' },
    { num: '02', title: 'The Execution Gap', desc: 'From strategy documents to street-level reality', pages: '26' },
    { num: '03', title: 'The Architecture of Trust', desc: 'Structural design for durable partnerships', pages: '31' },
    { num: '04', title: 'Reading the Unspoken Rules', desc: 'Relationship-driven decision-making in Kuwait', pages: '24' },
    { num: '05', title: 'Healthcare: A Case for Alliance', desc: 'Infrastructure, delivery, and the failure of isolation', pages: '28' },
    { num: '06', title: "Technology and the Regulator's Dilemma", desc: 'Why innovation needs protected airspace', pages: '22' },
    { num: '07', title: 'Education as Economic Policy', desc: 'Human capital as a shared asset', pages: '20' },
    { num: '08', title: 'SMEs and the Missing Middle', desc: 'Where the private sector needs a public partner', pages: '25' },
    { num: '09', title: 'Shared Risk, Shared Reward', desc: 'Designing the financial terms of partnership', pages: '27' },
    { num: '10', title: 'Accountability Without Paralysis', desc: 'Oversight that enables instead of obstructs', pages: '21' },
    { num: '11', title: 'The Commitment Ceremony', desc: 'Rituals, signals, and public promise', pages: '18' },
    { num: '12', title: 'Kuwait 2035, and Beyond', desc: 'Closing the gap between vision and arrival', pages: '20' }
  ],
  ar: [
    { num: '٠١', title: 'لماذا الزواج، لا الاندماج', desc: 'عن الاستعارات التي تشكّل الاستراتيجية الوطنية', pages: '٢٢' },
    { num: '٠٢', title: 'فجوة التنفيذ', desc: 'من وثائق الاستراتيجية إلى واقع الشارع', pages: '٢٦' },
    { num: '٠٣', title: 'هندسة الثقة', desc: 'تصميم هيكلي لشراكات مستدامة', pages: '٣١' },
    { num: '٠٤', title: 'قراءة القواعد غير المكتوبة', desc: 'صنع القرار القائم على العلاقات في الكويت', pages: '٢٤' },
    { num: '٠٥', title: 'الصحة: حالة للتحالف', desc: 'البنية التحتية، والتقديم، وفشل العزلة', pages: '٢٨' },
    { num: '٠٦', title: 'التقنية ومأزق المنظّم', desc: 'لماذا يحتاج الابتكار إلى مجال محمي', pages: '٢٢' },
    { num: '٠٧', title: 'التعليم سياسةً اقتصادية', desc: 'رأس المال البشري أصلاً مشتركاً', pages: '٢٠' },
    { num: '٠٨', title: 'الشركات الصغيرة والمتوسطة والوسط المفقود', desc: 'حيث يحتاج القطاع الخاص إلى شريك عام', pages: '٢٥' },
    { num: '٠٩', title: 'مخاطر مشتركة، مكافآت مشتركة', desc: 'تصميم الشروط المالية للشراكة', pages: '٢٧' },
    { num: '١٠', title: 'مساءلة بلا شلل', desc: 'رقابة تُمكّن بدلاً من أن تُعيق', pages: '٢١' },
    { num: '١١', title: 'مراسم الالتزام', desc: 'طقوس، وإشارات، ووعد علني', pages: '١٨' },
    { num: '١٢', title: 'الكويت ٢٠٣٥، وما بعدها', desc: 'إغلاق الفجوة بين الرؤية والوصول', pages: '٢٠' }
  ]
} as const;

// Section wrapper — consistent padding, gold rule, eyebrow
function SectionShell({
  eyebrow,
  title,
  subtitle,
  children
}: {
  eyebrow: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
      <div className="gold-rule mb-4" />
      <p className="eyebrow mb-5">{eyebrow}</p>
      {title && (
        <h2 className="font-serif text-3xl md:text-[32px] leading-tight text-emerald-700 font-medium mb-3 max-w-2xl">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm leading-[1.7] text-ink-muted max-w-xl italic mb-7">{subtitle}</p>
      )}
      {children}
    </section>
  );
}

// 1. Hero
function BookHero() {
  const t = useTranslations('book.hero');
  const locale = useLocale();
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (el) {
            const offset = -(window.scrollY * 0.18);
            el.style.transform = `translateY(${offset}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="bg-cream-50 border border-cream-400 rounded-[12px] overflow-hidden mb-4">
      <div className="grid md:grid-cols-[1.3fr_1fr] min-h-[460px]">
        <div className="p-9 md:p-10 flex flex-col justify-center">
          <div className="gold-rule mb-4" />
          <p className="eyebrow mb-5">{t('eyebrow')}</p>
          <h1 className={`text-3xl md:text-4xl text-emerald-700 font-medium leading-[1.05] mb-3 max-w-md ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
            {t('title')}
          </h1>
          <p className={`mb-5 text-emerald-700 font-medium ${locale === 'ar' ? 'font-sans text-lg' : 'font-serif-ar text-xl'}`} dir={locale === 'ar' ? 'ltr' : 'rtl'}>
            {t('titleAr')}
          </p>
          <p className="text-sm leading-[1.7] text-ink mb-6 max-w-md">{t('tagline')}</p>

          <div className="flex gap-6 mb-7">
            <div>
              <p className="font-serif text-2xl text-emerald-700 font-medium leading-none">{t('statChapters')}</p>
              <p className="eyebrow mt-1">{t('statChaptersLabel')}</p>
            </div>
            <div className="border-s border-cream-400 ps-6">
              <p className="font-serif text-2xl text-emerald-700 font-medium leading-none">{t('statPages')}</p>
              <p className="eyebrow mt-1">{t('statPagesLabel')}</p>
            </div>
            <div className="border-s border-cream-400 ps-6">
              <p className="font-serif text-2xl text-emerald-700 font-medium leading-none">{t('statFrom')}</p>
              <p className="eyebrow mt-1">{t('statFromLabel')}</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <a href="#preorder" className="bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-500 transition-colors">
              {t('primaryCta')}
            </a>
            <a href="#sample" className="bg-transparent text-emerald-700 border border-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-700 hover:text-cream-50 transition-colors">
              {t('secondaryCta')}
            </a>
          </div>
        </div>

        <div className="bg-cream-200 flex items-center justify-center p-8 book-float-stage">
          {/*
            3D levitating book cover — CSS perspective + bookLevitate keyframe.
            Parallax wrapper drifts the cover at 18% scroll rate for a floating feel.
            The actual cover image is displayed as-is per the cover spec — never recolor.
          */}
          <div ref={parallaxRef} style={{ willChange: 'transform' }}>
            <div className="book-float-inner">
              <div className="relative w-full max-w-[240px] aspect-[5/7]">
                <Image
                  src="/book-cover.jpg"
                  alt={locale === 'ar' ? 'غلاف كتاب «تزوّج الحكومة»' : 'Get Married with the Government — book cover'}
                  fill
                  priority
                  sizes="(max-width: 768px) 70vw, 240px"
                  className="object-cover rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-9 md:px-10 py-3 border-t border-cream-400 flex justify-between items-center">
        <p className="text-xs text-ink-muted font-serif italic">{t('footerStrip')}</p>
      </div>
    </section>
  );
}

// 2. About
function AboutTheBook() {
  const t = useTranslations('book.about');
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <div className="border-s-2 border-gold-400 ps-6 mb-7">
        <p className="font-serif text-lg leading-[1.55] text-emerald-700 font-medium italic mb-3">
          “{t('pullQuote')}”
        </p>
        <p className="eyebrow">— {t('pullQuoteBy')}</p>
      </div>
      <div className="max-w-2xl space-y-4">
        <p className="text-[15px] leading-[1.8] text-ink">{t('paragraph1')}</p>
        <p className="text-[15px] leading-[1.8] text-ink">{t('paragraph2')}</p>
        <p className="text-[15px] leading-[1.8] text-ink">{t('paragraph3')}</p>
        <p className="text-[15px] leading-[1.8] text-ink">{t('paragraph4')}</p>
      </div>
    </SectionShell>
  );
}

// 3. Featured 4 chapters
function FeaturedChapters() {
  const t = useTranslations('book.featured');
  const cards = [
    { num: t('card1Number'), title: t('card1Title'), desc: t('card1Desc') },
    { num: t('card2Number'), title: t('card2Title'), desc: t('card2Desc') },
    { num: t('card3Number'), title: t('card3Title'), desc: t('card3Desc') },
    { num: t('card4Number'), title: t('card4Title'), desc: t('card4Desc') }
  ];
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <div className="grid md:grid-cols-2 gap-4 stagger-cards">
        {cards.map((card) => (
          <div key={card.num} className="bg-cream-100 border border-cream-400 rounded-card p-6 min-h-[200px]">
            <p className="font-serif text-4xl text-gold-400 font-medium leading-none mb-3">{card.num}</p>
            <p className="font-serif text-xl text-emerald-700 font-medium leading-tight mb-3">{card.title}</p>
            <p className="text-sm leading-[1.7] text-ink">{card.desc}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

// 4. Full TOC
function FullTOC() {
  const t = useTranslations('book.toc');
  const locale = useLocale();
  const chapters = TOC[locale === 'ar' ? 'ar' : 'en'];

  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')}>
      <div className="border-t border-cream-400">
        {chapters.map((c, idx) => (
          <div
            key={c.num}
            className={`grid grid-cols-[36px_1fr_auto] gap-5 items-baseline py-4 ${
              idx === chapters.length - 1 ? '' : 'border-b border-cream-400'
            }`}
          >
            <p className="font-serif text-base text-gold-400 font-medium">{c.num}</p>
            <div>
              <p className={`text-base text-emerald-700 font-medium mb-1 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>{c.title}</p>
              <p className="text-[13px] leading-[1.6] text-ink">{c.desc}</p>
            </div>
            <p className="text-[11px] tracking-widest uppercase text-ink-muted whitespace-nowrap">
              {c.pages}&nbsp;{t('pagesLabel')}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-7 pt-4 border-t border-cream-400 flex justify-between items-baseline flex-wrap gap-2">
        <p className="font-serif text-sm text-emerald-700 italic">{t('footerLine')}</p>
        <a href="#sample" className="text-xs text-emerald-700 font-medium hover:text-emerald-500 transition-colors">{t('ctaLink')}</a>
      </div>
    </SectionShell>
  );
}

// 5. Chapter 1 sample
function ChapterSample() {
  const t = useTranslations('book.sample');
  return (
    <section id="sample" className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
      <div className="gold-rule mb-4" />
      <p className="eyebrow mb-5">{t('eyebrow')}</p>
      <h2 className="font-serif text-3xl md:text-[32px] leading-tight text-emerald-700 font-medium mb-7 max-w-xl">
        {t('title')}
      </h2>
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-8">
        <div className="bg-cream-100 border border-cream-400 rounded-card p-9">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-2">{t('chapterEyebrow')}</p>
          <p className="font-serif text-2xl text-emerald-700 font-medium leading-tight mb-5">{t('chapterTitle')}</p>
          <div className="gold-rule mb-5" />
          <p className="font-serif text-[15.5px] leading-[1.85] text-ink mb-4">{t('excerpt1')}</p>
          <p className="font-serif text-[15.5px] leading-[1.85] text-ink mb-5">{t('excerpt2')}</p>
          <p className="text-[11px] tracking-widest text-ink-muted text-center mt-5">{t('pageNumber')}</p>
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-serif text-2xl text-emerald-700 font-medium leading-tight mb-3">{t('formTitle')}</p>
          <p className="text-sm leading-[1.7] text-ink mb-5">{t('formDesc')}</p>
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            className="bg-cream-50 border border-cream-400 rounded-md px-4 py-3 text-sm text-ink mb-3 outline-none focus:border-emerald-700"
          />
          <button className="bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-500 transition-colors w-fit">
            {t('submit')}
          </button>
          <p className="text-xs text-ink-muted italic mt-4">{t('footnote')}</p>
        </div>
      </div>
    </section>
  );
}

// 6. Author
function AuthorBlock() {
  const t = useTranslations('book.author');
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-start">
        <div>
          <div className="border-s-2 border-gold-400 ps-6 mb-6">
            <p className="font-serif text-[18px] leading-[1.55] text-emerald-700 font-medium italic">“{t('pullQuote')}”</p>
          </div>
          <p className="text-[14.5px] leading-[1.8] text-ink mb-3">{t('paragraph1')}</p>
          <p className="text-[14.5px] leading-[1.8] text-ink mb-5">{t('paragraph2')}</p>
          <div className="border-s-2 border-cream-400 ps-6 mb-7">
            <p className="font-serif text-[15.5px] leading-[1.7] text-ink italic">“{t('secondQuote')}”</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[t('credential1'), t('credential2'), t('credential3')].map((c) => (
              <span key={c} className="border border-gold-400 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-cream-200 rounded-sm p-6 flex items-center justify-center">
          <div className="relative w-full aspect-[3/4] bg-emerald-700 rounded-sm overflow-hidden">
            <Image
              src="/ali-portrait-en.jpg"
              alt="Eng. Ali Abdullah Mubarak"
              fill
              sizes="(max-width: 768px) 70vw, 30vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

// 7. Endorsements
function Endorsements() {
  const t = useTranslations('book.endorsements');
  const items = [
    { quote: t('quote1'), name: t('name1'), title: t('title1'), initial: 'F' },
    { quote: t('quote2'), name: t('name2'), title: t('title2'), initial: 'K' },
    { quote: t('quote3'), name: t('name3'), title: t('title3'), initial: 'N' }
  ];
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <div className="grid md:grid-cols-3 gap-4 stagger-cards">
        {items.map((item, i) => (
          <div key={i} className="bg-cream-100 border border-cream-400 rounded-card p-6 flex flex-col">
            <p className="font-serif text-3xl text-gold-400 font-medium leading-[0.5] mb-5">“</p>
            <p className="font-serif text-sm leading-[1.7] text-ink italic mb-6 flex-1">{item.quote}</p>
            <div className="flex items-center gap-2.5 pt-4 border-t border-cream-400">
              <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-gold-400 font-serif text-sm font-medium flex-shrink-0">
                {item.initial}
              </div>
              <div>
                <p className="font-serif text-sm text-emerald-700 font-medium">{item.name}</p>
                <p className="text-[11px] text-ink-muted">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

// 8. Speaking
function Speaking() {
  const t = useTranslations('book.speaking');
  const topics = [
    { title: t('topic1Title'), format: t('topic1Format') },
    { title: t('topic2Title'), format: t('topic2Format') },
    { title: t('topic3Title'), format: t('topic3Format') },
    { title: t('topic4Title'), format: t('topic4Format') }
  ];
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <p className="text-[15px] leading-[1.8] text-ink mb-7 max-w-2xl">{t('body')}</p>
      <p className="eyebrow mb-3">{t('topicsLabel')}</p>
      <div className="grid md:grid-cols-2 gap-3 mb-7 stagger-cards">
        {topics.map((topic) => (
          <div key={topic.title} className="bg-cream-100 border border-cream-400 rounded-card p-5">
            <p className="font-serif text-base text-emerald-700 font-medium">{topic.title}</p>
            <p className="text-xs text-ink-muted mt-1">{topic.format}</p>
          </div>
        ))}
      </div>
      <button className="bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-500 transition-colors">
        {t('cta')}
      </button>
    </SectionShell>
  );
}

// 9. Pre-order
function Preorder() {
  const t = useTranslations('book.preorder');
  return (
    <section id="preorder" className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
      <div className="gold-rule mb-4" />
      <p className="eyebrow mb-5">{t('eyebrow')}</p>
      <h2 className="font-serif text-3xl md:text-[32px] leading-tight text-emerald-700 font-medium mb-3">{t('title')}</h2>
      <p className="text-sm leading-[1.7] text-ink-muted italic max-w-xl mb-7">{t('subtitle')}</p>

      <div className="grid md:grid-cols-3 gap-3 mb-8">
        <div className="bg-cream-100 border border-cream-400 rounded-card p-6 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400 mb-2">{t('edition1Eyebrow')}</p>
          <p className="text-[13px] leading-[1.55] text-ink mb-4">{t('edition1Desc')}</p>
          <p className="font-serif text-3xl text-emerald-700 font-medium">
            {t('edition1Price')} <span className="text-sm text-ink-muted">{t('edition1Currency')}</span>
          </p>
        </div>
        <div className="bg-cream-100 border border-cream-400 rounded-card p-6 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400 mb-2">{t('edition2Eyebrow')}</p>
          <p className="text-[13px] leading-[1.55] text-ink mb-4">{t('edition2Desc')}</p>
          <p className="font-serif text-3xl text-emerald-700 font-medium">
            {t('edition2Price')} <span className="text-sm text-ink-muted">{t('edition2Currency')}</span>
          </p>
        </div>
        <div className="bg-emerald-700 border border-emerald-700 rounded-card p-6 text-center relative">
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gold-400 text-cream-50 text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
            {t('edition3Badge')}
          </span>
          <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400 mb-2">{t('edition3Eyebrow')}</p>
          <p className="text-[13px] leading-[1.55] text-cream-50 mb-4">{t('edition3Desc')}</p>
          <p className="font-serif text-3xl text-cream-50 font-medium">
            {t('edition3Price')} <span className="text-sm text-gold-400">{t('edition3Currency')}</span>
          </p>
        </div>
      </div>

      <p className="eyebrow mb-3">{t('fieldsLabel')}</p>
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <input type="text" placeholder={t('firstName')} className="bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700" />
        <input type="text" placeholder={t('lastName')} className="bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700" />
      </div>
      <input type="email" placeholder={t('email')} className="w-full bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 mb-2.5" />
      <input type="tel" placeholder={t('phone')} className="w-full bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 mb-2.5" />
      <select defaultValue="" className="w-full bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 mb-2.5">
        <option value="" disabled>{t('country')}</option>
        <option>Kuwait</option><option>Saudi Arabia</option><option>UAE</option>
        <option>Bahrain</option><option>Qatar</option><option>Oman</option><option>Other</option>
      </select>
      <input type="text" placeholder={t('shippingAddress')} className="w-full bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 mb-5" />

      <div className="flex justify-between items-center py-4 border-y border-cream-400 mb-5">
        <p className="eyebrow">{t('totalLabel')}</p>
        <p className="font-serif text-2xl text-emerald-700 font-medium">16 KD</p>
      </div>

      <button className="w-full bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md py-3.5 text-sm font-medium hover:bg-emerald-500 transition-colors">
        {t('submit')}
      </button>
      <p className="text-[11.5px] text-ink-muted italic text-center mt-4 leading-[1.6]">{t('footnote')}</p>
    </section>
  );
}

// 10. Newsletter
function Newsletter() {
  const t = useTranslations('book.newsletter');
  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <p className="text-sm leading-[1.75] text-ink italic max-w-xl mb-6">{t('subtitle')}</p>
      <div className="flex gap-2.5 max-w-md">
        <input type="email" placeholder={t('emailPlaceholder')} className="flex-1 bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700" />
        <button className="bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-500 transition-colors whitespace-nowrap">
          {t('submit')}
        </button>
      </div>
    </SectionShell>
  );
}

// 11. Contact
function Contact() {
  const t = useTranslations('book.contact');
  const links = [
    { label: t('linkEmailLabel'), value: t('linkEmailValue'), href: 'mailto:ali@alimubarak1.com' },
    { label: t('linkInstagramLabel'), value: t('linkInstagramValue'), href: 'https://instagram.com/alimubarak1' },
    { label: t('linkPreorderLabel'), value: t('linkPreorderValue'), href: '#preorder' },
    { label: t('linkSpeakingLabel'), value: t('linkSpeakingValue'), href: '#speaking' }
  ];

  return (
    <SectionShell eyebrow={t('eyebrow')} title={t('title')}>
      <p className="text-sm leading-[1.75] text-ink mb-7 max-w-xl">{t('subtitle')}</p>

      <div className="grid md:grid-cols-2 gap-3.5 mb-8">
        {links.map((link) => (
          <a key={link.label} href={link.href} className="bg-cream-100 border border-cream-400 rounded-card px-5 py-4 hover:border-emerald-700 transition-colors">
            <p className="text-[10px] tracking-widest uppercase text-gold-400 mb-1">{link.label}</p>
            <p className="text-sm text-emerald-700 font-medium">{link.value}</p>
          </a>
        ))}
      </div>

      <p className="eyebrow mb-3">{t('messageLabel')}</p>
      <div className="grid md:grid-cols-2 gap-2.5 mb-2.5">
        <input type="text" placeholder={t('name')} className="bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700" />
        <input type="email" placeholder={t('email') ?? 'Email'} className="bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700" />
      </div>
      <select defaultValue="" className="w-full bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 mb-2.5">
        <option value="" disabled>{t('subject')}</option>
        <option>{t('subjectGeneral')}</option>
        <option>{t('subjectSpeaking')}</option>
        <option>{t('subjectMedia')}</option>
        <option>{t('subjectBulk')}</option>
        <option>{t('subjectAdvisory')}</option>
      </select>
      <textarea placeholder={t('message')} rows={4} className="w-full bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 mb-5 resize-y" />
      <button className="bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md px-5 py-3 text-sm font-medium hover:bg-emerald-500 transition-colors">
        {t('submit')}
      </button>
    </SectionShell>
  );
}

export default function BookPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 page-enter">
      <BookHero />
      <ScrollReveal><AboutTheBook />   </ScrollReveal>
      <ScrollReveal><FeaturedChapters /></ScrollReveal>
      <ScrollReveal><FullTOC />        </ScrollReveal>
      <ScrollReveal><ChapterSample />  </ScrollReveal>
      <ScrollReveal><AuthorBlock />    </ScrollReveal>
      <ScrollReveal><Endorsements />   </ScrollReveal>
      <ScrollReveal><Speaking />       </ScrollReveal>
      <ScrollReveal><Preorder />       </ScrollReveal>
      <ScrollReveal><Newsletter />     </ScrollReveal>
      <ScrollReveal><Contact />        </ScrollReveal>
    </div>
  );
}
