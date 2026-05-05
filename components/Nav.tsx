'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Top navigation — 5 tabs per locked sitemap.
// Sticky: starts as plain cream, transitions to frosted glass on scroll.
// Active tab shows a gold underline. Language toggle on the far side.

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const otherLocale = locale === 'en' ? 'ar' : 'en';
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
  const otherLocalePath = `/${otherLocale}${pathWithoutLocale}`;

  const tabs = [
    { href: `/${locale}/about`,       label: t('about') },
    { href: `/${locale}/ventures`,    label: t('ventures') },
    { href: `/${locale}/influence`,   label: t('influence') },
    { href: `/${locale}/book`,        label: t('book') },
    { href: `/${locale}/work-with-ali`, label: t('workWithAli') }
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'nav-frosted'
          : 'bg-cream-50 border-b border-cream-400/40'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-serif text-xl text-emerald-700 font-medium tracking-tight hover:text-emerald-500 transition-colors duration-200"
        >
          Ali Mubarak
        </Link>

        {/* Nav tabs */}
        <nav className="hidden md:flex items-center gap-7">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`text-sm relative group transition-colors duration-200 ${
                  active
                    ? 'text-emerald-700 font-medium'
                    : 'text-ink hover:text-emerald-700'
                }`}
              >
                {tab.label}
                {/* Gold underline — full-width on active, animates from 0 on hover */}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold-400 transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Language toggle */}
        <Link
          href={otherLocalePath}
          className="text-xs tracking-widest text-ink-muted hover:text-emerald-700 transition-colors duration-200 border-l border-cream-400 pl-4"
          aria-label={`Switch to ${otherLocale === 'ar' ? 'Arabic' : 'English'}`}
        >
          {t('languageToggle')}
        </Link>
      </div>
    </header>
  );
}
