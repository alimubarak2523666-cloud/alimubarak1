'use client';

import { useTranslations, useLocale } from 'next-intl';
import ScrollReveal from './ScrollReveal';

export default function WorkWithAliPage() {
  const t = useTranslations('workWithAli');
  const locale = useLocale();

  const services = [
    { titleKey: 'service1Title', descKey: 'service1Desc' },
    { titleKey: 'service2Title', descKey: 'service2Desc' },
    { titleKey: 'service3Title', descKey: 'service3Desc' }
  ] as const;

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

      {/* Service cards */}
      <ScrollReveal>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12 mb-4">
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((service, i) => (
              <div
                key={service.titleKey}
                className="card-lift bg-cream-100 border border-cream-400 rounded-card p-6 flex flex-col"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <p className={`font-serif text-lg text-emerald-700 font-medium leading-tight mb-3 ${locale === 'ar' ? 'font-serif-ar' : ''}`}>
                  {t(service.titleKey)}
                </p>
                <p className="text-sm leading-[1.7] text-ink">{t(service.descKey)}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Contact form */}
      <ScrollReveal delay={80}>
        <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-10 md:p-12">
          <div className="gold-rule mb-4" />
          <p className="eyebrow mb-5">{locale === 'ar' ? 'تواصل مباشر' : 'Direct contact'}</p>
          <h2 className="font-serif text-3xl md:text-[32px] leading-tight text-emerald-700 font-medium mb-3">
            {t('formTitle')}
          </h2>
          <p className="text-sm leading-[1.7] text-ink max-w-xl mb-7">{t('formDesc')}</p>

          <div className="grid md:grid-cols-2 gap-2.5 mb-2.5">
            <input type="text" placeholder={t('name')} className="bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 transition-colors" />
            <input type="email" placeholder={t('email')} className="bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 transition-colors" />
          </div>
          <input type="text" placeholder={t('company')} className="w-full bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 transition-colors mb-2.5" />
          <select defaultValue="" className="w-full bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 transition-colors mb-2.5">
            <option value="" disabled>{t('subject')}</option>
            <option>{t('subjectAdvisory')}</option>
            <option>{t('subjectSpeaking')}</option>
            <option>{t('subjectBoard')}</option>
            <option>{t('subjectMedia')}</option>
            <option>{t('subjectOther')}</option>
          </select>
          <textarea placeholder={t('message')} rows={5} className="w-full bg-cream-100 border border-cream-400 rounded-md px-3.5 py-3 text-sm text-ink outline-none focus:border-emerald-700 transition-colors mb-5 resize-y" />
          <button className="btn-primary bg-emerald-700 text-cream-50 border border-emerald-700 rounded-md px-6 py-3 text-sm font-medium hover:bg-emerald-500">
            {t('submit')}
          </button>
        </section>
      </ScrollReveal>
    </div>
  );
}
