'use client';

import { useLocale } from 'next-intl';

// ─────────────────────────────────────────────────────────────────────────────
// LogoStrip — continuously scrolling partnership / brand logos
// Sits just below the Hero on the homepage as a social-proof strip.
// Uses pure CSS animation (no JS scroll); duplicated list ensures seamless loop.
// ─────────────────────────────────────────────────────────────────────────────

interface LogoItem {
  id: string;
  name: string;
  nameAr: string;
  bgColor: string;
  textColor: string;
}

const LOGOS: LogoItem[] = [
  { id: 'ali-alghanim',  name: 'Ali Alghanim & Sons',  nameAr: 'علي الغانم وأولاده',   bgColor: '#0d2137', textColor: '#ffffff' },
  { id: 'rolls-royce',   name: 'Rolls-Royce',           nameAr: 'رولز رويس',             bgColor: '#1a0099', textColor: '#ffffff' },
  { id: 'bmw',           name: 'BMW',                    nameAr: 'بي إم دبليو',           bgColor: '#1c69d4', textColor: '#ffffff' },
  { id: 'warba-bank',    name: 'Warba Bank',             nameAr: 'بنك وربة',              bgColor: '#5b2d8e', textColor: '#ffffff' },
  { id: 'gulf-bank',     name: 'Gulf Bank',              nameAr: 'بنك الخليج',            bgColor: '#c8102e', textColor: '#ffffff' },
  { id: 'boubyan',       name: 'Boubyan Bank',           nameAr: 'بنك بوبيان',            bgColor: '#111111', textColor: '#ffffff' },
  { id: 'burger-king',   name: 'Burger King',            nameAr: 'برغر كنج',              bgColor: '#d62300', textColor: '#ffffff' },
  { id: 'koshari',       name: 'Koshari Bites',          nameAr: 'كشري بايتس',            bgColor: '#2d6a4f', textColor: '#ffffff' },
  { id: 'abraj',         name: 'Abraj',                  nameAr: 'أبراج مياه',            bgColor: '#1565c0', textColor: '#ffffff' },
  { id: 'efashion',      name: 'eFashion',               nameAr: 'إي فاشن',               bgColor: '#111111', textColor: '#ffffff' },
  { id: 'boutiqaat',     name: 'Boutiqaat',              nameAr: 'بوتيكات',               bgColor: '#111111', textColor: '#ffffff' },
  { id: 'the-regency',   name: 'The Regency',            nameAr: 'الريجنسي',              bgColor: '#9a7b3e', textColor: '#ffffff' },
  { id: 'ghadana',       name: 'Ghadana',                nameAr: 'غذانا',                 bgColor: '#e65c00', textColor: '#ffffff' },
  { id: 'lofat',         name: 'Lofat',                  nameAr: 'لوفات',                 bgColor: '#2e7d32', textColor: '#ffffff' },
  { id: 'mini',          name: 'MINI',                   nameAr: 'ميني',                  bgColor: '#111111', textColor: '#ffffff' },
  { id: 'land-rover',    name: 'Range Rover',            nameAr: 'رينج روفر',             bgColor: '#111111', textColor: '#ffffff' },
];

function LogoBadge({ logo, locale }: { logo: LogoItem; locale: string }) {
  const displayName = locale === 'ar' ? logo.nameAr : logo.name;

  return (
    <div className="flex-shrink-0 mx-3 flex items-center gap-3 bg-cream-100 border border-cream-400 rounded-lg px-4 py-2.5 select-none">
      {/* Colour dot */}
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: logo.bgColor }}
        aria-hidden
      />
      {/* Logo image with text fallback */}
      <LogoImage logo={logo} />
      {/* Name label */}
      <span className="text-[11.5px] text-ink whitespace-nowrap font-medium tracking-tight">
        {displayName}
      </span>
    </div>
  );
}

function LogoImage({ logo }: { logo: LogoItem }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={`/logos/${logo.id}.png`}
      alt=""
      aria-hidden
      className="h-5 w-auto max-w-[52px] object-contain"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.endsWith('.png')) {
          img.src = `/logos/${logo.id}.svg`;
        } else {
          img.style.display = 'none';
        }
      }}
      loading="lazy"
    />
  );
}

export default function LogoStrip() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Duplicate the list so the CSS loop is seamless
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <div className="border-t border-b border-cream-400 bg-cream-50 overflow-hidden py-1">
      {/* Eyebrow label */}
      <div className="flex items-center gap-4 px-6 pt-4 pb-1">
        <div className="w-6 h-px bg-gold-400 flex-shrink-0" />
        <p className="text-[9px] tracking-[0.28em] uppercase text-ink-muted">
          {isAr ? 'من أبرز الشراكات' : 'Selected partnerships'}
        </p>
      </div>

      {/* Scrolling track */}
      <div
        className="relative w-full overflow-hidden py-3"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div
          className={`flex items-center w-max ${isAr ? 'logo-scroll-rtl' : 'logo-scroll'}`}
          aria-hidden="true"
        >
          {doubled.map((logo, i) => (
            <LogoBadge key={`${logo.id}-${i}`} logo={logo} locale={locale} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes logoScrollLTR {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes logoScrollRTL {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .logo-scroll {
          animation: logoScrollLTR 38s linear infinite;
        }
        .logo-scroll-rtl {
          animation: logoScrollRTL 38s linear infinite;
        }
        .logo-scroll:hover,
        .logo-scroll-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
