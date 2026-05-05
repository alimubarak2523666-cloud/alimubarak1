'use client';

import { useTranslations, useLocale } from 'next-intl';
import ScrollReveal from './ScrollReveal';
import { useState } from 'react';

interface Partner {
  id: string;
  name: string;
  nameAr: string;
  bgColor: string;
  textColor: string;
  instagram: string;
}

interface Category {
  id: string;
  label: string;
  labelAr: string;
  icon: string;
  partners: Partner[];
}

const CATEGORIES: Category[] = [
  {
    id: 'automotive',
    label: 'Automotive',
    labelAr: 'السيارات',
    icon: '🚗',
    partners: [
      { id: 'ali-alghanim',  name: 'Ali Alghanim & Sons Automotive', nameAr: 'علي الغانم وأولاده للسيارات', bgColor: '#ffffff', textColor: '#0d2137', instagram: 'https://www.instagram.com/alialghanimsons/' },
      { id: 'rolls-royce',   name: 'Rolls-Royce',   nameAr: 'رولز رويس',          bgColor: '#ffffff', textColor: '#1a0099', instagram: 'https://www.instagram.com/rollsroycekwt/' },
      { id: 'bmw',           name: 'BMW',            nameAr: 'بي إم دبليو',        bgColor: '#ffffff', textColor: '#1c69d4', instagram: 'https://www.instagram.com/bmwmiddleeast/' },
      { id: 'mini',          name: 'MINI',           nameAr: 'ميني',               bgColor: '#ffffff', textColor: '#111111', instagram: 'https://www.instagram.com/mini_kuwaitofficial/' },
      { id: 'land-rover',    name: 'Land Rover · Range Rover', nameAr: 'لاند روفر · رينج روفر', bgColor: '#ffffff', textColor: '#111111', instagram: 'https://www.instagram.com/alialghanimlandroverkuwait/' },
    ],
  },
  {
    id: 'banking',
    label: 'Banking & Finance',
    labelAr: 'البنوك والمال',
    icon: '🏦',
    partners: [
      { id: 'warba-bank',  name: 'Warba Bank',    nameAr: 'بنك وربة',   bgColor: '#ffffff', textColor: '#5b2d8e', instagram: 'https://www.instagram.com/warba_bank/' },
      { id: 'gulf-bank',   name: 'Gulf Bank',     nameAr: 'بنك الخليج', bgColor: '#ffffff', textColor: '#c8102e', instagram: 'https://www.instagram.com/gulf_bank/' },
      { id: 'boubyan',     name: 'Boubyan Bank',  nameAr: 'بنك بوبيان', bgColor: '#ffffff', textColor: '#111111', instagram: 'https://www.instagram.com/bankboubyan/' },
    ],
  },
  {
    id: 'food',
    label: 'Food & Beverage',
    labelAr: 'المأكولات والمشروبات',
    icon: '🍔',
    partners: [
      { id: 'burger-king', name: 'Burger King',   nameAr: 'برغر كنج',    bgColor: '#ffffff', textColor: '#d62300', instagram: 'https://www.instagram.com/burgerkingkw/' },
      { id: 'koshari',     name: 'Koshari Bites', nameAr: 'كشري بايتس', bgColor: '#ffffff', textColor: '#2d6a4f', instagram: 'https://www.instagram.com/kosharibites/' },
      { id: 'abraj',       name: 'Abraj',         nameAr: 'أبراج مياه',  bgColor: '#ffffff', textColor: '#1565c0', instagram: 'https://www.instagram.com/abraajwater/' },
      { id: 'ghadana',     name: 'Ghadana',       nameAr: 'غذانا',       bgColor: '#e65c00', textColor: '#ffffff', instagram: 'https://www.instagram.com/mn_ghadana/' },
      { id: 'lofat',       name: 'Lofat',         nameAr: 'لوفات',       bgColor: '#ffffff', textColor: '#2e7d32', instagram: 'https://www.instagram.com/lofateats/' },
      { id: 'tobo',         name: 'TOBO',         nameAr: 'توبو',        bgColor: '#111111', textColor: '#ffffff', instagram: 'https://www.instagram.com/mytobo/' },
    ],
  },
  {
    id: 'tech',
    label: 'Technology & Electronics',
    labelAr: 'التقنية والإلكترونيات',
    icon: '📱',
    partners: [
      { id: 'eureka',       name: 'Eureka',       nameAr: 'يوريكا',      bgColor: '#ffffff', textColor: '#00843d', instagram: 'https://www.instagram.com/eurekakuwait/' },
      { id: 'mobile-2000',  name: 'Mobile 2000',  nameAr: 'موبايل 2000', bgColor: '#ffffff', textColor: '#00b4d8', instagram: 'https://www.instagram.com/mobile2000/' },
    ],
  },
  {
    id: 'fashion',
    label: 'Fashion & Lifestyle',
    labelAr: 'الأزياء ونمط الحياة',
    icon: '👗',
    partners: [
      { id: 'efashion',   name: 'eFashion',   nameAr: 'إي فاشن', bgColor: '#ffffff', textColor: '#111111', instagram: 'https://www.instagram.com/efashionq8/' },
      { id: 'boutiqaat',  name: 'Boutiqaat',  nameAr: 'بوتيكات', bgColor: '#ffffff', textColor: '#111111', instagram: 'https://www.instagram.com/boutiqaat/' },
    ],
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    labelAr: 'الضيافة',
    icon: '🏨',
    partners: [
      { id: 'the-regency', name: 'The Regency', nameAr: 'الريجنسي', bgColor: '#ffffff', textColor: '#9a7b3e', instagram: 'https://www.instagram.com/theregency.kw/' },
    ],
  },
];

const ALL_PARTNERS = CATEGORIES.flatMap((c) => c.partners);

function LogoCard({ partner, locale, size = 'normal' }: { partner: Partner; locale: string; size?: 'normal' | 'large' }) {
  const [imgSrc, setImgSrc] = useState(`/logos/${partner.id}.png`);
  const [imgFailed, setImgFailed] = useState(false);
  const displayName = locale === 'ar' ? partner.nameAr : partner.name;
  const h = size === 'large' ? 'min-h-[160px]' : 'min-h-[120px]';
  const imgH = size === 'large' ? 'max-h-20' : 'max-h-14';

  const handleImgError = () => {
    if (imgSrc.endsWith('.png')) {
      setImgSrc(`/logos/${partner.id}.svg`); // try SVG next
    } else {
      setImgFailed(true); // both failed → text fallback
    }
  };

  return (
    <a
      href={partner.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center card-lift rounded-[10px] overflow-hidden border border-cream-400 hover:border-emerald-700 transition-all duration-300 bg-cream-50"
      aria-label={`${partner.name} on Instagram`}
    >
      <div
        className={`w-full flex items-center justify-center px-6 py-6 ${h} relative`}
        style={{ backgroundColor: partner.bgColor }}
      >
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={partner.name}
            className={`${imgH} max-w-[180px] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300`}
            onError={handleImgError}
            loading="lazy"
          />
        ) : (
          <span
            className="font-serif text-base md:text-lg font-medium tracking-tight text-center leading-tight px-2"
            style={{ color: partner.textColor }}
          >
            {partner.name}
          </span>
        )}
        {/* Instagram hover badge */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="#E1306C" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full px-4 py-2.5 border-t border-cream-400 bg-cream-50 flex items-center justify-between gap-2">
        <p className="text-[11px] text-ink-muted tracking-wide truncate">{displayName}</p>
        <svg className="w-3 h-3 text-ink-muted/50 flex-shrink-0 group-hover:text-emerald-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
}

export default function PartnersPage() {
  const t = useTranslations('partners');
  const locale = useLocale();

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

      {/* Stats strip */}
      <ScrollReveal>
        <section className="bg-emerald-700 rounded-[12px] p-8 md:p-10 mb-4">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className={`text-3xl md:text-4xl text-cream-50 font-medium mb-1 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
                {ALL_PARTNERS.length}
              </p>
              <p className="text-[10px] tracking-[0.22em] uppercase text-gold-400">
                {locale === 'ar' ? 'شراكة' : 'Partnerships'}
              </p>
            </div>
            <div>
              <p className={`text-3xl md:text-4xl text-cream-50 font-medium mb-1 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
                {CATEGORIES.length}
              </p>
              <p className="text-[10px] tracking-[0.22em] uppercase text-gold-400">
                {locale === 'ar' ? 'قطاعات' : 'Industries'}
              </p>
            </div>
            <div>
              <p className={`text-3xl md:text-4xl text-cream-50 font-medium mb-1 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
                KW
              </p>
              <p className="text-[10px] tracking-[0.22em] uppercase text-gold-400">
                {locale === 'ar' ? 'السوق الرئيسي' : 'Primary Market'}
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Categories */}
      {CATEGORIES.map((cat, catIdx) => (
        <ScrollReveal key={cat.id} delay={catIdx * 30}>
          <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-8 md:p-10 mb-4">
            {/* Category header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">{cat.icon}</span>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-gold-500 font-medium leading-none mb-0.5">
                  {locale === 'ar' ? cat.labelAr : cat.label}
                </p>
                <p className="text-[10px] text-ink-muted">
                  {cat.partners.length} {locale === 'ar' ? 'علامة تجارية' : cat.partners.length === 1 ? 'brand' : 'brands'}
                </p>
              </div>
            </div>

            {/* Logo grid — adapts column count to partner count */}
            <div className={`grid gap-3 ${
              cat.partners.length === 1
                ? 'grid-cols-1 max-w-xs'
                : cat.partners.length === 2
                ? 'grid-cols-2 max-w-sm'
                : cat.partners.length <= 4
                ? 'grid-cols-2 md:grid-cols-4'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
            }`}>
              {cat.partners.map((partner, i) => (
                <div key={partner.id} className="animate-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <LogoCard
                    partner={partner}
                    locale={locale}
                    size={cat.partners.length <= 3 ? 'large' : 'normal'}
                  />
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      ))}

      {/* CTA */}
      <ScrollReveal delay={80}>
        <section className="bg-emerald-700 rounded-[12px] p-10 md:p-14">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-4">{t('ctaEyebrow')}</p>
          <h2 className={`text-2xl md:text-3xl text-cream-50 font-medium leading-tight mb-3 max-w-xl ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
            {t('ctaTitle')}
          </h2>
          <p className="text-sm text-cream-200/80 leading-[1.7] max-w-xl mb-6">{t('ctaDesc')}</p>
          <a
            href={`/${locale}/work-with-ali`}
            className="inline-block bg-gold-400 text-cream-50 border border-gold-400 rounded-md px-6 py-3 text-sm font-medium hover:bg-gold-600 transition-colors"
          >
            {t('ctaButton')}
          </a>
        </section>
      </ScrollReveal>

    </div>
  );
}
