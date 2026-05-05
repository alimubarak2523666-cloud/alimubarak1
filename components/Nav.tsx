'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Top navigation — sticky, frosted glass on scroll.
// Desktop: horizontal tab row. Mobile: hamburger → slide-down drawer.

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const otherLocale = locale === 'en' ? 'ar' : 'en';
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
  const otherLocalePath = `/${otherLocale}${pathWithoutLocale}`;

  const tabs = [
    { href: `/${locale}/about`,         label: t('about') },
    { href: `/${locale}/ventures`,      label: t('ventures') },
    { href: `/${locale}/influence`,     label: t('influence') },
    { href: `/${locale}/partners`,      label: t('partners') },
    { href: `/${locale}/book`,          label: t('book') },
    { href: `/${locale}/youtube`,       label: t('youtube') },
    { href: `/${locale}/work-with-ali`, label: t('workWithAli') },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'nav-frosted' : 'bg-cream-50 border-b border-cream-400/40'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-serif text-xl text-emerald-700 font-medium tracking-tight hover:text-emerald-500 transition-colors duration-200 shrink-0"
        >
          Ali Mubarak
        </Link>

        {/* Desktop nav tabs */}
        <nav className="hidden md:flex items-center gap-7">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`text-sm relative group transition-colors duration-200 ${
                  active ? 'text-emerald-700 font-medium' : 'text-ink hover:text-emerald-700'
                }`}
              >
                {tab.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold-400 transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right side: language toggle + mobile hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href={otherLocalePath}
            className="text-xs tracking-widest text-ink-muted hover:text-emerald-700 transition-colors duration-200 border-s border-cream-400 ps-3"
            aria-label={`Switch to ${otherLocale === 'ar' ? 'Arabic' : 'English'}`}
          >
            {t('languageToggle')}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] focus:outline-none"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className={`block w-5 h-px bg-emerald-700 transition-all duration-300 origin-center ${
                menuOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-emerald-700 transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-emerald-700 transition-all duration-300 origin-center ${
                menuOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 border-t border-cream-400/40' : 'max-h-0'
        } bg-cream-50`}
      >
        <nav className="px-4 py-4 flex flex-col gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 px-2 text-sm border-b border-cream-400/30 last:border-0 transition-colors duration-200 flex items-center justify-between ${
                  active
                    ? 'text-emerald-700 font-medium'
                    : 'text-ink hover:text-emerald-700'
                }`}
              >
                {tab.label}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
