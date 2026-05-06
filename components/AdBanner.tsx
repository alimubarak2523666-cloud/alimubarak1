'use client';

import { useLocale } from 'next-intl';

// ─────────────────────────────────────────────────────────────────────────────
// AdBanner — 4-slot sponsored partner banner
// Sits between the Hero and LogoStrip on the homepage.
// Each slot shows the brand logo on white, brand-coloured bar below,
// short tagline, and a CTA linking to the brand's Instagram account.
// ─────────────────────────────────────────────────────────────────────────────

interface AdSlot {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  instagram: string;
  handle: string;
  accentColor: string;
  barFrom: string;
  barTo: string;
  ctaColor: string;
  logoFile: string;
}

const ADS: AdSlot[] = [
  {
    id: 'warba-bank',
    name: 'Warba Bank',
    nameAr: 'بنك وربة',
    tagline: "Let's Own Tomorrow — Kuwait's digital-first Islamic bank built for the next generation.",
    taglineAr: 'غداً لنا — بنك كويتي إسلامي رقمي بُني للجيل القادم.',
    instagram: 'https://www.instagram.com/warba_bank/',
    handle: '@warba_bank',
    accentColor: '#7c45c8',
    barFrom: '#5b2d8e',
    barTo: '#3d1a68',
    ctaColor: '#c9aef0',
    logoFile: '/logos/warba-bank.svg',
  },
  {
    id: 'ali-alghanim',
    name: 'Ali Alghanim & Sons',
    nameAr: 'علي الغانم وأولاده',
    tagline: 'BMW · Rolls-Royce · MINI · Land Rover — Kuwait\'s home for the world\'s finest cars.',
    taglineAr: 'بي إم دبليو · رولز رويس · ميني · لاند روفر — وجهتك للسيارات الفارهة في الكويت.',
    instagram: 'https://www.instagram.com/alialghanimsons/',
    handle: '@alialghanimsons',
    accentColor: '#c8a020',
    barFrom: '#0d2137',
    barTo: '#060f1b',
    ctaColor: '#c8a020',
    logoFile: '/logos/ali-alghanim.png',
  },
  {
    id: 'gulf-bank',
    name: 'Gulf Bank',
    nameAr: 'بنك الخليج',
    tagline: 'Our traditions always bring us together — powering Kuwait\'s businesses and families since 1960.',
    taglineAr: 'تقاليدنا تجمعنا دائماً — ندعم الشركات والأسر الكويتية منذ ١٩٦٠.',
    instagram: 'https://www.instagram.com/gulf_bank/',
    handle: '@gulf_bank',
    accentColor: '#c8102e',
    barFrom: '#c8102e',
    barTo: '#8c0a20',
    ctaColor: '#ffb0be',
    logoFile: '/logos/gulf-bank.png',
  },
  {
    id: 'eureka',
    name: 'Eureka',
    nameAr: 'يوريكا',
    tagline: "Kuwait's leading megastore for electronics, appliances & multimedia — all under one roof.",
    taglineAr: 'وجهتك الأولى للإلكترونيات والأجهزة والوسائط المتعددة في الكويت.',
    instagram: 'https://www.instagram.com/eurekakuwait/',
    handle: '@eurekakuwait',
    accentColor: '#00843d',
    barFrom: '#00843d',
    barTo: '#005528',
    ctaColor: '#7ee8a2',
    logoFile: '/logos/eureka.svg',
  },
];

function InstagramIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

function AdCard({ ad, locale }: { ad: AdSlot; locale: string }) {
  const isAr = locale === 'ar';
  return (
    <a
      href={ad.instagram}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col rounded-[11px] overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
      aria-label={`${ad.name} — sponsored, opens Instagram`}
    >
      {/* Brand accent line */}
      <div className="h-1 w-full flex-shrink-0" style={{ backgroundColor: ad.accentColor }} />

      {/* Logo on white */}
      <div className="bg-white flex items-center justify-center px-4 py-4 h-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.logoFile}
          alt={ad.name}
          className="max-h-14 max-w-full w-auto object-contain"
          loading="lazy"
        />
      </div>

      {/* Coloured bar */}
      <div
        className="flex flex-col flex-1 justify-between px-3.5 py-3"
        style={{ background: `linear-gradient(150deg, ${ad.barFrom}, ${ad.barTo})` }}
      >
        <div>
          <p className="font-serif text-[12px] font-medium text-white leading-snug mb-1">
            {isAr ? ad.nameAr : ad.name}
          </p>
          <p className="text-[9.5px] leading-[1.55] text-white/70 mb-2">
            {isAr ? ad.taglineAr : ad.tagline}
          </p>
        </div>

        {/* Instagram CTA */}
        <div
          className="flex items-center gap-1.5 pt-2"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.14)' }}
        >
          <InstagramIcon />
          <span className="text-[9px] text-white/50 truncate">{ad.handle}</span>
          <span
            className="ml-auto text-[8.5px] tracking-[0.1em] uppercase font-medium flex-shrink-0"
            style={{ color: ad.ctaColor }}
          >
            {isAr ? 'تابع ←' : 'Follow →'}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function AdBanner() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <div className="bg-cream-50 border-b border-cream-400">
      {/* Eyebrow */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-2">
        <div className="w-4 h-px bg-gold-400 flex-shrink-0" />
        <p className="text-[8.5px] tracking-[0.28em] uppercase text-ink-muted">
          {isAr ? 'محتوى برعاية' : 'Featured partners'}
        </p>
        <span className="ms-auto text-[7.5px] tracking-[0.14em] uppercase text-ink-muted/60 bg-cream-100 border border-cream-400 rounded-full px-2 py-0.5">
          {isAr ? 'برعاية' : 'Sponsored'}
        </span>
      </div>

      {/* 4-slot grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 px-3.5 pb-3.5">
        {ADS.map((ad) => (
          <AdCard key={ad.id} ad={ad} locale={locale} />
        ))}
      </div>
    </div>
  );
}
