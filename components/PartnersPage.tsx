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
      { id: 'ali-alghanim',  name: 'Ali Alghanim & Sons Automotive', nameAr: 'علي الغانم وأولاده للسيارات', bgColor: '#ffffff', textColor: '#0d2137' },
      { id: 'rolls-royce',   name: 'Rolls-Royce',   nameAr: 'رولز رويس',          bgColor: '#ffffff', textColor: '#1a0099' },
      { id: 'bmw',           name: 'BMW',            nameAr: 'بي إم دبليو',        bgColor: '#111111', textColor: '#ffffff' },
      { id: 'mini',          name: 'MINI',           nameAr: 'ميني',               bgColor: '#111111', textColor: '#c0c0c0' },
      { id: 'land-rover',    name: 'Land Rover · Range Rover', nameAr: 'لاند روفر · رينج روفر', bgColor: '#111111', textColor: '#ffffff' },
    ],
  },
  {
    id: 'banking',
    label: 'Banking & Finance',
    labelAr: 'البنوك والمال',
    icon: '🏦',
    partners: [
      { id: 'warba-bank',  name: 'Warba Bank',    nameAr: 'بنك وربة',   bgColor: '#ffffff', textColor: '#5b2d8e' },
      { id: 'gulf-bank',   name: 'Gulf Bank',     nameAr: 'بنك الخليج', bgColor: '#ffffff', textColor: '#c8102e' },
      { id: 'boubyan',     name: 'Boubyan Bank',  nameAr: 'بنك بوبيان', bgColor: '#111111', textColor: '#ffffff' },
    ],
  },
  {
    id: 'food',
    label: 'Food & Beverage',
    labelAr: 'المأكولات والمشروبات',
    icon: '🍔',
    partners: [
      { id: 'burger-king', name: 'Burger King',   nameAr: 'برغر كنج',    bgColor: '#ffffff', textColor: '#d62300' },
      { id: 'koshari',     name: 'Koshari Bites', nameAr: 'كشري بايتس', bgColor: '#ffffff', textColor: '#2d6a4f' },
      { id: 'abraj',       name: 'Abraj',         nameAr: 'أبراج مياه',  bgColor: '#ffffff', textColor: '#1565c0' },
      { id: 'ghadana',     name: 'Ghadana',       nameAr: 'غذانا',       bgColor: '#ffffff', textColor: '#e65c00' },
      { id: 'lofat',       name: 'Lofat',         nameAr: 'لوفات',       bgColor: '#ffffff', textColor: '#2e7d32' },
    ],
  },
  {
    id: 'tech',
    label: 'Technology & Electronics',
    labelAr: 'التقنية والإلكترونيات',
    icon: '📱',
    partners: [
      { id: 'eureka',       name: 'Eureka',       nameAr: 'يوريكا',      bgColor: '#ffffff', textColor: '#00843d' },
      { id: 'mobile-2000',  name: 'Mobile 2000',  nameAr: 'موبايل 2000', bgColor: '#111111', textColor: '#00b4d8' },
      { id: 'tobo',         name: 'TOBO',         nameAr: 'توبو',        bgColor: '#111111', textColor: '#ffffff' },
    ],
  },
  {
    id: 'fashion',
    label: 'Fashion & Lifestyle',
    labelAr: 'الأزياء ونمط الحياة',
    icon: '👗',
    partners: [
      { id: 'efashion',   name: 'eFashion',   nameAr: 'إي فاشن', bgColor: '#ffffff', textColor: '#111111' },
      { id: 'boutiqaat',  name: 'Boutiqaat',  nameAr: 'بوتيكات', bgColor: '#ffffff', textColor: '#111111' },
    ],
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    labelAr: 'الضيافة',
    icon: '🏨',
    partners: [
      { id: 'the-regency', name: 'The Regency', nameAr: 'الريجنسي', bgColor: '#ffffff', textColor: '#9a7b3e' },
    ],
  },
];

const ALL_PARTNERS = CATEGORIES.flatMap((c) => c.partners);

function LogoCard({ partner, locale, size = 'normal' }: { partner: Partner; locale: string; size?: 'normal' | 'large' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const displayName = locale === 'ar' ? partner.nameAr : partner.name;
  const h = size === 'large' ? 'min-h-[160px]' : 'min-h-[120px]';
  const imgH = size === 'large' ? 'max-h-20' : 'max-h-14';

  return (
    <div className={`group flex flex-col items-center card-lift rounded-[10px] overflow-hidden border border-cream-400 hover:border-emerald-700 transition-all duration-300 bg-cream-50`}>
      <div
        className={`w-full flex items-center justify-center px-6 py-6 ${h}`}
        style={{ backgroundColor: partner.bgColor }}
      >
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/logos/${partner.id}.png`}
            alt={partner.name}
            className={`${imgH} max-w-[180px] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300`}
            onError={() => setImgFailed(true)}
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
      </div>
      <div className="w-full px-4 py-2.5 border-t border-cream-400 bg-cream-50">
        <p className="text-[11px] text-ink-muted text-center tracking-wide truncate">{displayName}</p>
      </div>
    </div>
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
