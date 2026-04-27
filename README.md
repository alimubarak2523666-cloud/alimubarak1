# alimubarak1.com

Personal portfolio HQ for Ali Abdullah Mubarak — engineer, entrepreneur, strategic advisor, and author. Houses his ventures (EVA Integrated Co., Koshari Bites, Ali Abdullah Mubarak Co., The National Incubator), his book *Get Married with the Government*, his media platform, and his executive advisory services.

Built bilingual (English / Arabic, full RTL) on Next.js 14 App Router + Tailwind + next-intl, deployed to Vercel.

## Stack

- Next.js 14 (App Router) with TypeScript
- Tailwind CSS with locked design tokens (Direction B — Cultured Gulf Executive)
- next-intl for full bilingual routing (`/en/...` and `/ar/...`)
- Google Fonts: Playfair Display (English serif), Inter (English sans), Noto Naskh Arabic (Arabic serif), IBM Plex Sans Arabic (Arabic sans)
- Deployed to Vercel, custom domain alimubarak1.com

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 — middleware redirects to `/en` (or `/ar`).

## Project structure

```
app/
├── layout.tsx                 # Root layout (minimal)
├── globals.css                # Design tokens, eyebrow utility, gold rule
└── [locale]/                  # All routed pages live here
    ├── layout.tsx             # Loads fonts, sets html dir, mounts Nav + Footer
    └── page.tsx               # Homepage

components/
├── Nav.tsx                    # 5-tab top nav with language toggle
├── Footer.tsx                 # Minimal footer
└── Hero.tsx                   # Locked hero composition

messages/
├── en.json                    # English copy
└── ar.json                    # Arabic copy

middleware.ts                  # next-intl locale routing
i18n.ts                        # Locale config + message loader
tailwind.config.ts             # Design tokens (emerald / cream / gold)
```

## Locked decisions

See `~/Library/Application Support/Claude/.../memory/` for the full set:

- **Sitemap:** 5 tabs — About / Ventures / Influence / Book / Work With Ali
- **Direction:** B — Cultured Gulf Executive (emerald `#0e4a3e` + cream `#faf6ee` + gold `#a17b3a`)
- **Typography:** Playfair Display + Inter (English), Noto Naskh Arabic + IBM Plex Sans Arabic (Arabic)
- **Bilingual photos:** English hero uses formal navy-suit portrait, Arabic hero uses warm Khaleeji portrait
- **Build pace:** Bit by bit — never one-shot the whole site

## Pending assets

Drop these files into `/public/` before the live build will look complete:

- `ali-portrait-formal-en.jpg` — formal navy suit portrait, hand-on-chin
- `ali-portrait-warm-ar.jpg` — warm Khaleeji portrait with yellow boutonnière
- `book-cover.jpg` — *Get Married with the Government* cover artwork (use AS-IS, do not recolor)
