'use client';

import { useTranslations, useLocale } from 'next-intl';
import ScrollReveal from './ScrollReveal';
import { useState } from 'react';

interface Partner {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  bgColor: string;   // background color of the logo card
  textColor: string; // fallback text color
}

const PARTNERS: Partner[] = [
  {
    id: 'eureka',
    name: 'Eureka',
    nameAr: 'يوريكا',
    category: 'Electronics',
    categoryAr: 'إلكترونيات',
    bgColor: '#ffffff',
    textColor: '#00843d',
  },
  {
    id: 'efashion',
    name: 'eFashion',
    nameAr: 'إي فاشن',
    category: 'Fashion',
    categoryAr: 'أزياء',
    bgColor: '#ffffff',
    textColor: '#111111',
  },
  {
    id: 'the-regency',
    name: 'The Regency',
    nameAr: 'الريجنسي',
    category: 'Hospitality',
    categoryAr: 'ضيافة',
    bgColor: '#ffffff',
    textColor: '#9a7b3e',
  },
  {
    id: 'boutiqaat',
    name: 'Boutiqaat',
    nameAr: 'بوتيكات',
    category: 'Fashion & Beauty',
    categoryAr: 'أزياء وجمال',
    bgColor: '#ffffff',
    textColor: '#111111',
  },
  {
    id: 'koshari',
    name: 'Koshari Bites',
    nameAr: 'كشري بايتس',
    category: 'Food & Beverage',
    categoryAr: 'مأكولات ومشروبات',
    bgColor: '#ffffff',
    textColor: '#2d6a4f',
  },
  {
    id: 'abraj',
    name: 'Abraj',
    nameAr: 'أبراج مياه',
    category: 'Beverages',
    categoryAr: 'مشروبات',
    bgColor: '#ffffff',
    textColor: '#1565c0',
  },
  {
    id: 'ghadana',
    name: 'Ghadana',
    nameAr: 'غذانا',
    category: 'Food & Beverage',
    categoryAr: 'مأكولات ومشروبات',
    bgColor: '#ffffff',
    textColor: '#e65c00',
  },
  {
    id: 'lofat',
    name: 'Lofat',
    nameAr: 'لوفات',
    category: 'Food & Delivery',
    categoryAr: 'غذاء وتوصيل',
    bgColor: '#ffffff',
    textColor: '#2e7d32',
  },
  {
    id: 'tobo',
    name: 'TOBO',
    nameAr: 'توبو',
    category: 'Lifestyle',
    categoryAr: 'نمط حياة',
    bgColor: '#111111',
    textColor: '#ffffff',
  },
  {
    id: 'burger-king',
    name: 'Burger King',
    nameAr: 'برغر كنج',
    category: 'Food & Beverage',
    categoryAr: 'مأكولات ومشروبات',
    bgColor: '#ffffff',
    textColor: '#d62300',
  },
  {
    id: 'mobile-2000',
    name: 'Mobile 2000',
    nameAr: 'موبايل 2000',
    category: 'Technology',
    categoryAr: 'تقنية',
    bgColor: '#111111',
    textColor: '#00b4d8',
  },
];

function LogoCard({ partner, locale }: { partner: Partner; locale: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  const displayName = locale === 'ar' ? partner.nameAr : partner.name;
  const displayCategory = locale === 'ar' ? partner.categoryAr : partner.category;

  return (
    <div className="group flex flex-col items-center card-lift rounded-[10px] overflow-hidden border border-cream-400 hover:border-emerald-700 transition-colors duration-200 bg-cream-50">
      {/* Logo area */}
      <div
        className="w-full flex items-center justify-center p-8"
        style={{ backgroundColor: partner.bgColor, minHeight: '140px' }}
      >
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/logos/${partner.id}.png`}
            alt={partner.name}
            className="max-h-16 max-w-[160px] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgFailed(true)}
            loading="lazy"
          />
        ) : (
          /* Fallback: styled brand name */
          <span
            className="font-serif text-xl font-medium tracking-tight text-center"
            style={{ color: partner.textColor }}
          >
            {partner.name}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="w-full px-5 py-3 border-t border-cream-400">
        <p className="text-xs text-ink-muted text-center tracking-wide">{displayCategory}</p>
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
        <h1
          className={`text-4xl md:text-5xl text-emerald-700 font-medium leading-[1.1] mb-4 ${
            locale === 'ar' ? 'font-serif-ar' : 'font-serif'
          }`}
        >
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
                {PARTNERS.length}+
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-gold-400">
                {locale === 'ar' ? 'شراكة' : 'Partnerships'}
              </p>
            </div>
            <div>
              <p className={`text-3xl md:text-4xl text-cream-50 font-medium mb-1 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
                5+
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-gold-400">
                {locale === 'ar' ? 'سنوات خبرة' : 'Years Active'}
              </p>
            </div>
            <div>
              <p className={`text-3xl md:text-4xl text-cream-50 font-medium mb-1 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
                KW
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-gold-400">
                {locale === 'ar' ? 'السوق الرئيسي' : 'Primary Market'}
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Logo grid */}
      <ScrollReveal delay={40}>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
          <div className="gold-rule mb-4" />
          <p className="eyebrow mb-8">{t('gridEyebrow')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PARTNERS.map((partner, i) => (
              <ScrollReveal key={partner.id} delay={i * 40}>
                <LogoCard partner={partner} locale={locale} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={60}>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12">
          <div className="gold-rule mb-4" />
          <p className="eyebrow mb-4">{t('ctaEyebrow')}</p>
          <h2 className={`text-2xl md:text-3xl text-emerald-700 font-medium leading-tight mb-3 ${locale === 'ar' ? 'font-serif-ar' : 'font-serif'}`}>
            {t('ctaTitle')}
          </h2>
          <p className="text-sm text-ink leading-[1.7] max-w-xl mb-6">{t('ctaDesc')}</p>
          <a
            href={`/${locale}/work-with-ali`}
            className="btn-primary inline-block bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md px-6 py-3 text-sm font-medium hover:bg-emerald-500 transition-colors"
          >
            {t('ctaButton')}
          </a>
        </section>
      </ScrollReveal>

    </div>
  );
}
