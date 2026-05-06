import { MetadataRoute } from 'next';

const BASE_URL = 'https://alimubarak1.com';

const pages = [
  { path: '',               priority: 1.0, freq: 'weekly'  },
  { path: '/about',         priority: 0.9, freq: 'monthly' },
  { path: '/network',       priority: 0.9, freq: 'monthly' },
  { path: '/ventures',      priority: 0.8, freq: 'monthly' },
  { path: '/ventures/eva',  priority: 0.7, freq: 'monthly' },
  { path: '/ventures/koshari-bites', priority: 0.7, freq: 'monthly' },
  { path: '/ventures/amc',  priority: 0.7, freq: 'monthly' },
  { path: '/ventures/tni',  priority: 0.7, freq: 'monthly' },
  { path: '/influence',     priority: 0.8, freq: 'monthly' },
  { path: '/book',          priority: 0.9, freq: 'monthly' },
  { path: '/work-with-ali', priority: 0.8, freq: 'monthly' },
  { path: '/partners',      priority: 0.6, freq: 'monthly' },
  { path: '/youtube',       priority: 0.6, freq: 'weekly'  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ['en', 'ar']) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.freq as MetadataRoute.Sitemap[0]['changeFrequency'],
        priority: page.priority,
      });
    }
  }

  return entries;
}
