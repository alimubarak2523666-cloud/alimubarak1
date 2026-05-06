'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

// Ordered photo roster — most impactful first
const photos = [
  {
    src: '/network/IMG_1185.JPG',
    captionEn: 'Media Panel, CNBC Arabia & Al-Arabiya',
    captionAr: 'لقاء إعلامي، CNBC Arabia وقناة العربية',
    category: 'media',
  },
  {
    src: '/network/b2506e8c-2baa-47aa-ba27-b7df7b003340.jpg',
    captionEn: 'TV Studio Broadcast, Kuwait',
    captionAr: 'استوديو تلفزيوني، الكويت',
    category: 'media',
  },
  {
    src: '/network/IMG_6273.jpeg',
    captionEn: 'Official Meeting, Kuwait Government',
    captionAr: 'لقاء رسمي، الحكومة الكويتية',
    category: 'government',
  },
  {
    src: '/network/IMG_6562.jpeg',
    captionEn: 'Formal Reception, Kuwait',
    captionAr: 'استقبال رسمي، الكويت',
    category: 'government',
  },
  {
    src: '/network/IMG_6674.JPG',
    captionEn: 'Senior Leadership Meeting, Kuwait',
    captionAr: 'لقاء مع قيادات رفيعة، الكويت',
    category: 'government',
  },
  {
    src: '/network/IMG_4388.jpeg',
    captionEn: 'Official Coordination Meeting, Kuwait',
    captionAr: 'اجتماع تنسيق رسمي، الكويت',
    category: 'government',
  },
  {
    src: '/network/IMG_2671.JPG',
    captionEn: 'Government Office Meeting, Kuwait',
    captionAr: 'اجتماع حكومي، الكويت',
    category: 'government',
  },
  {
    src: '/network/IMG_2961.jpeg',
    captionEn: 'National Security Coordination, Kuwait',
    captionAr: 'تنسيق أمني وطني، الكويت',
    category: 'government',
  },
  {
    src: '/network/e45ca8cc-3825-4ce5-99a6-2f7b335068f4.jpg',
    captionEn: 'VIP Reception, Kuwait',
    captionAr: 'استقبال كبار الشخصيات، الكويت',
    category: 'government',
  },
  {
    src: '/network/083d617b-c89e-42fe-b74b-c287b260bed2.jpg',
    captionEn: 'Official Engagement, Kuwait',
    captionAr: 'لقاء رسمي، الكويت',
    category: 'government',
  },
  {
    src: '/network/811396b0-9044-496b-ac80-0bf33bbca9b5.jpg',
    captionEn: 'Leadership Meeting, Gulf Region',
    captionAr: 'لقاء قيادي، منطقة الخليج',
    category: 'government',
  },
  {
    src: '/network/IMG_4004.JPG',
    captionEn: 'Kuwait Investment Forum',
    captionAr: 'منتدى الاستثمار الكويتي',
    category: 'events',
  },
  {
    src: '/network/IMG_1011.JPG',
    captionEn: 'Press Conference Panel, Kuwait',
    captionAr: 'مؤتمر صحفي، الكويت',
    category: 'media',
  },
  {
    src: '/network/IMG_0642.jpeg',
    captionEn: 'Official Event, Kuwait',
    captionAr: 'فعالية رسمية، الكويت',
    category: 'events',
  },
  {
    src: '/network/9d5ad2b3-5a6a-4401-beea-fa8d19219004.jpg',
    captionEn: 'VIP Dinner, Kuwait',
    captionAr: 'عشاء كبار الشخصيات، الكويت',
    category: 'events',
  },
  {
    src: '/network/C5BAB5C6-7986-430A-B9E1-40593122C695.jpg',
    captionEn: 'Official Gathering, Kuwait',
    captionAr: 'تجمع رسمي، الكويت',
    category: 'events',
  },
  {
    src: '/network/dd6dafbe-af65-4d45-980e-3871a47b13c2.jpg',
    captionEn: 'Formal Reception, Kuwait',
    captionAr: 'استقبال رسمي، الكويت',
    category: 'events',
  },
  {
    src: '/network/2666D56C-BFD6-481A-96AA-F55549C036F1.jpg',
    captionEn: 'Senior Official Meeting, Kuwait',
    captionAr: 'لقاء مع مسؤول رفيع، الكويت',
    category: 'government',
  },
  {
    src: '/network/IMG_7324.JPG',
    captionEn: 'Arab Media Forum — Award Ceremony',
    captionAr: 'منتدى الإعلام العربي — حفل تكريم',
    category: 'awards',
  },
  {
    src: '/network/IMG_7410.JPG',
    captionEn: 'Gulf Excellence Award Ceremony',
    captionAr: 'حفل جائزة التميز الخليجي',
    category: 'awards',
  },
  {
    src: '/network/377BE7F4-9DB7-4F2F-9B11-50316D09A479.jpg',
    captionEn: 'Award Ceremony, Kuwait',
    captionAr: 'حفل تكريم، الكويت',
    category: 'awards',
  },
  {
    src: '/network/F5344906-5A5F-4DAA-B5FC-F2361F743556.jpg',
    captionEn: 'Award Recognition, Kuwait',
    captionAr: 'تكريم وجائزة، الكويت',
    category: 'awards',
  },
  {
    src: '/network/IMG_2597.jpeg',
    captionEn: 'On Stage, Official Event',
    captionAr: 'على المنصة، فعالية رسمية',
    category: 'awards',
  },
  {
    src: '/network/076bfd04-a892-44c2-868a-e5638ac9b977.jpg',
    captionEn: 'Media Broadcast, Kuwait',
    captionAr: 'إعلام وبث، الكويت',
    category: 'media',
  },
  {
    src: '/network/IMG_1815.JPG',
    captionEn: 'National Event, Kuwait',
    captionAr: 'فعالية وطنية، الكويت',
    category: 'events',
  },
  {
    src: '/network/IMG_2280.JPG',
    captionEn: 'Speaking Engagement, Australia',
    captionAr: 'محاضرة دولية، أستراليا',
    category: 'international',
  },
  {
    src: '/network/IMG_0627.JPG',
    captionEn: 'Community Event, Kuwait',
    captionAr: 'فعالية مجتمعية، الكويت',
    category: 'events',
  },
];

const stats = [
  { numEn: '27+', numAr: '+٢٧', labelEn: 'Events & meetings', labelAr: 'فعاليات واجتماعات' },
  { numEn: '15+', numAr: '+١٥', labelEn: 'Government officials', labelAr: 'مسؤول حكومي' },
  { numEn: '5+', numAr: '+٥', labelEn: 'Countries', labelAr: 'دول' },
  { numEn: '25+', numAr: '+٢٥', labelEn: 'Years of access', labelAr: 'عاماً في الميدان' },
];

export default function NetworkPage() {
  const t = useTranslations('network');
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 page-enter">

      {/* Hero header */}
      <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-14 mb-4">
        <div className="gold-rule mb-4" />
        <p className="eyebrow mb-5">{t('eyebrow')}</p>
        <h1 className={`text-4xl md:text-5xl text-emerald-700 font-medium leading-[1.1] mb-5 ${isAr ? 'font-serif-ar' : 'font-serif'}`}>
          {t('title')}
        </h1>
        <p className="text-base md:text-lg text-ink leading-[1.7] max-w-2xl mb-10">
          {t('subtitle')}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.numEn} className="bg-cream-100 border border-cream-400 rounded-card p-5 text-center">
              <p className={`text-3xl text-emerald-700 font-medium mb-1 ${isAr ? 'font-serif-ar' : 'font-serif'}`}>
                {isAr ? s.numAr : s.numEn}
              </p>
              <p className="text-xs text-ink-muted tracking-wide uppercase">
                {isAr ? s.labelAr : s.labelEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo grid */}
      <ScrollReveal>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-6 md:p-10 mb-4">
          <p className="eyebrow mb-8">{t('galleryEyebrow')}</p>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
            {photos.map((photo, i) => (
              <div
                key={photo.src}
                className="break-inside-avoid group relative overflow-hidden rounded-card bg-cream-200"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="relative w-full">
                  <Image
                    src={photo.src}
                    alt={isAr ? photo.captionAr : photo.captionEn}
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {/* Caption overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className={`text-xs text-cream-50 leading-snug ${isAr ? 'font-serif-ar text-right' : ''}`}>
                    {isAr ? photo.captionAr : photo.captionEn}
                  </p>
                </div>
                {/* Always-visible caption below image */}
                <div className={`px-3 py-2 ${isAr ? 'text-right' : ''}`}>
                  <p className={`text-xs text-ink-muted leading-snug ${isAr ? 'font-serif-ar' : ''}`}>
                    {isAr ? photo.captionAr : photo.captionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={60}>
        <section className="bg-emerald-700 rounded-[12px] p-10 md:p-14">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-4">{t('ctaEyebrow')}</p>
          <h2 className={`text-2xl md:text-3xl text-cream-50 font-medium leading-tight mb-4 max-w-xl ${isAr ? 'font-serif-ar' : 'font-serif'}`}>
            {t('ctaTitle')}
          </h2>
          <p className="text-sm text-cream-200 leading-[1.7] max-w-lg mb-7">{t('ctaBody')}</p>
          <a
            href={`/${locale}/work-with-ali`}
            className="inline-block bg-gold-400 text-emerald-900 text-sm font-medium px-6 py-3 rounded-full hover:bg-gold-300 transition-colors duration-200"
          >
            {t('ctaCta')}
          </a>
        </section>
      </ScrollReveal>

    </div>
  );
}
