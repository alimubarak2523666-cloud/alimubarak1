'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

// Top navigation. 5 tabs per the locked sitemap:
//   About / Ventures / Influence / Book / Work With Ali
// Logo on the far side returns home; language toggle on the opposite far side.

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  // Strip leading /en or /ar from the current path, then prefix the other locale
  const otherLocale = locale === 'en' ? 'ar' : 'en';
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
  const otherLocalePath = `/${otherLocale}${pathWithoutLocale}`;

  const tabs = [
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/ventures`, label: t('ventures') },
    { href: `/${locale}/influence`, label: t('influence') },
    { href: `/${locale}/book`, label: t('book') },
    { href: `/${locale}/work-with-ali`, label: t('workWithAli') }
  ];

  return (
    <header className="border-b border-cream-400/60 bg-cream-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
        <Link
          href={`/${locale}`}
          className="font-serif text-xl text-emerald-700 font-medium tracking-tight"
        >
          Ali Mubarak
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="text-sm text-ink hover:text-emerald-700 transition-colors"
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <Link
          href={otherLocalePath}
          className="text-xs tracking-widest text-ink-muted hover:text-emerald-700 transition-colors border-l border-cream-400 pl-4"
          aria-label={`Switch to ${otherLocale === 'ar' ? 'Arabic' : 'English'}`}
        >
          {t('languageToggle')}
        </Link>
      </div>
    </header>
  );
}
