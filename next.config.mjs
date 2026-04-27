import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Skip Next.js Image optimization on Netlify — their optimizer was returning
    // empty bytes for our portraits. Browser fetches the JPGs directly from /public.
    unoptimized: true
  }
};

export default withNextIntl(nextConfig);
