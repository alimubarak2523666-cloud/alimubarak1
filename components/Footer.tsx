import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-cream-400/60 bg-cream-50 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between gap-6 text-xs text-ink-muted">
        <p>{t('rights')}</p>
        <p className="tracking-widest uppercase">{t('tagline')}</p>
      </div>
    </footer>
  );
}
