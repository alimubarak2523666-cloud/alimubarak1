---
name: arabic-rtl-web
description: Build, fix and review Arabic right-to-left (RTL) and bilingual Arabic/English websites and web apps so the Arabic side looks designed-for-Arabic, not a mirrored English page. Use whenever Ali works on alimubarak1.com, The Edit store (admin, supplier, driver, cart, checkout, login pages), a clinic or Koshari Bites landing page, or any HTML/React/Next.js/Tailwind code that shows Arabic — adding an Arabic version, a language toggle, fixing "the Arabic looks broken", reversed phone numbers or prices, text on the wrong side, broken Arabic letters, or reviewing a page before launch. Triggers include RTL, right-to-left, dir=rtl, Arabic version of the site, /ar route, next-intl, bilingual site, language switcher, mirrored layout, logical properties, «النسخة العربية من الموقع», «الموقع بالعربي», «الاتجاه من اليمين». Use it even when the request only says "make the site Arabic" or "check the store in Arabic".
---

# Arabic RTL web

RTL bugs are invisible in an English review and obvious to every Arabic reader.
Nearly all of them come from two habits: writing `left`/`right` where the layout
should follow reading direction, and leaving numbers, phones, prices and Latin
words to fend for themselves inside Arabic sentences. Write code that avoids
them from the start, then prove it with the checker and a screenshot in both
directions.

## Step 0 — decide what kind of page this is (do this first)

The right fix depends on the page's language model. Getting this wrong produces
hundreds of false "bugs" (this happened on The Edit store, which is an
English-only page with a few Arabic accent lines).

| Page type | How to tell | What "correct" means |
|---|---|---|
| **A. Fully bilingual** (e.g. alimubarak1.com `/en` + `/ar`) | locale routing, `messages/ar.json`, a language toggle | Whole layout mirrors in Arabic. Logical CSS everywhere. `dir` set on `<html>` per locale before first paint. |
| **B. Arabic-first** | Arabic is the default language | `<html lang="ar" dir="rtl">` in static HTML. English terms isolated inline. |
| **C. English page with Arabic accents** (The Edit store today) | `lang="en"`, no toggle, Arabic only in taglines/labels/names | Do **not** flip the page. Mark each Arabic snippet `lang="ar" dir="rtl"`, load an Arabic font for it, no letter-spacing on it. Physical `left/right` is fine here. |

If the user asks to "make it Arabic" on a type-C page, that is a conversion to
type A — say so and scope it before editing.

## The six rules (types A and B)

1. **Direction lives in HTML, before first paint.** `<html lang="ar" dir="rtl">`
   in the static HTML or root layout. For runtime language choice, set `lang`
   and `dir` from an inline `<head>` script. Never use CSS `direction` for page
   direction — browsers, screen readers and Tailwind's `rtl:` variant read the
   attribute.
2. **Logical CSS only.** `margin-inline-start/end`, `padding-inline-*`,
   `border-inline-*`, `inset-inline-*`, `text-align: start/end`,
   `border-start-start-radius` etc. Tailwind table below.
3. **Flex and grid already follow `dir`.** Never add `flex-row-reverse` "for
   RTL" — it flips twice, back to LTR order.
4. **Isolate mixed-direction values.** Prices, order numbers, phones, emails,
   URLs, product codes and Latin brand names inside Arabic text get reordered
   by the bidi algorithm. Wrap unknown-direction values in `<bdi>`; give user
   text `dir="auto"`; give `type="tel"`, `type="email"`, `type="url"` inputs
   `dir="ltr"`.
5. **Respect the script.** No `letter-spacing` on Arabic (it breaks the joins
   between letters — scope tracking with `:lang(en)`). No `text-transform:
   uppercase` expectations. Arabic body text needs line-height ≈1.7–1.8 or dots
   clip. Form controls don't inherit the font: `button,input,select,textarea{font:inherit}`.
6. **Mirror direction, not meaning.** Mirror back/next arrows, chevrons,
   progress bars, sliders, carousels, drawer slide-ins (`translateX` is
   physical). Do not mirror logos, play buttons, check marks, clocks, charts'
   numeric axes, or phone/card numbers.

## Tailwind: physical → logical

| Physical (does not flip) | Logical (flips with `dir`) |
|---|---|
| `ml-* mr-* pl-* pr-*` | `ms-* me-* ps-* pe-*` |
| `left-* right-*` | `start-* end-*` |
| `text-left text-right` | `text-start text-end` |
| `rounded-l-* rounded-r-*` | `rounded-s-* rounded-e-*` |
| `border-l-* border-r-*` | `border-s-* border-e-*` |
| `space-x-*` | `gap-x-*` on the parent |

Use `rtl:`/`ltr:` variants only for truly per-direction things (an icon flip,
a transform).

## Ali's stack specifics

- **alimubarak1.com** — Next.js 14 App Router + next-intl + Tailwind. `dir` is
  set in `app/[locale]/layout.tsx`; keep it there, server-rendered, so there is
  no LTR flash. Copy lives in `messages/en.json` / `messages/ar.json`; keep
  keys identical in both and never translate ICU placeholders like `{amount}`.
- **Arabic font: Cairo** for all new Arabic UI (Google Fonts,
  `family=Cairo:wght@400;600;700`). English stays Playfair Display / Inter.
  Never let Arabic fall back to Playfair or Inter. Note: alimubarak1.com's
  locked tokens still load Noto Naskh Arabic / IBM Plex Sans Arabic, and the
  store loads Reem Kufi / IBM Plex Sans Arabic — switching an existing page to
  Cairo means changing its font link and CSS tokens, so do it deliberately and
  check the render (Cairo runs taller; re-check line-height and button sizes).
- **The Edit store** (`public/store/`) — plain HTML + inline CSS/JS, currently
  type C. Governorate names come from `theedit-data.js` (`GOV[].ar`).
- **Kuwait formats:** phone `+965 XXXX XXXX` (8 digits) always `dir="ltr"`;
  money in KWD has **3 decimals** (fils) — `12.500 د.ك` or `KWD 12.500`; keep
  the amount inside `<bdi>`. Choose Western (1 2 3) or Arabic-Indic (١ ٢ ٣)
  digits once per product and apply everywhere — Western is the norm for
  prices, phones and order numbers in Kuwaiti e-commerce.

## Workflow

1. **Classify** the page (Step 0).
2. **Write/fix** following the rules. When converting, change physical to
   logical in the same edit rather than adding `[dir=rtl]` overrides.
3. **Run the checker** (standard-library Python, no install):
   ```bash
   python3 <skill-dir>/scripts/rtl_check.py <paths...>          # errors + warnings
   python3 <skill-dir>/scripts/rtl_check.py <paths...> --json   # machine-readable
   ```
   For type-C pages, only these findings matter: `css-letter-spacing` on
   elements that hold Arabic, missing `lang`/`dir` on Arabic snippets, and
   Arabic font coverage. Report the rest as "not applicable while the page is
   English-only" instead of "fixing" them. Mark intentional physical lines with
   the comment `rtl-check: ignore`.
4. **Look at it.** Render both directions with Playwright (Chromium at
   `/opt/pw-browsers/chromium` in cloud sessions) at phone width (390px) and
   desktop, and view the screenshots. Check: text on the correct side, no
   horizontal scroll, arrows pointing the reading way, prices/phones not
   reversed, no letters pulled apart, no tofu boxes (□).
5. **Report** what changed, what was verified in the browser, and anything
   intentionally left (with the reason).

## Common traps

- **Direction flash:** static HTML says `lang="en"`, script switches to RTL
  after load → every first visit jumps. Server-render the direction.
- **Off-canvas drawers** parked with `left:0; translateX(-100%)` create a
  horizontal scrollbar in RTL. Use `inset-inline-start`, mirror the transform
  under `[dir="rtl"]`, and `overflow-x: clip`.
- **Icons in `<svg>` with `margin-right`** next to Arabic labels end up on the
  wrong side — use `margin-inline-end` or flex `gap`.
- **Select options** can't hold `<bdi>`; order them `Arabic · English` for the
  Arabic locale and keep them short.
- **Email/SMS templates** also need `dir="rtl"` on the wrapper `<table>`/`<div>` —
  many mail clients ignore `<html dir>`.

## Credits

`scripts/rtl_check.py` is from [rtl-skill](https://github.com/mhamedmohammed92-arch/rtl-skill)
by Tervatrix, MIT License (see `scripts/LICENSE-rtl_check.txt`). Some rules above
are adapted from the same project.
