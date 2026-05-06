// Root layout — minimal, the [locale]/layout.tsx does the real work.
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ali Mubarak',
  description:
    'Engineer · Entrepreneur · Strategic Advisor · Author. Building companies, advising executives, and bridging government and private sector across Kuwait and the GCC.',
  verification: {
    google: 'cJxJ1joTL4RSkZnXbtJBx3pYX0vjVQSj7UFbnHQYnKI',
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
