---
name: arabic-rtl-deck
description: Builds and repairs Arabic and bilingual Arabic/English presentations (PowerPoint .pptx or single-file HTML) that read correctly right-to-left — bank credit presentations, Ministry of Public Works (MPW) tender presentations, MoD / KBAD counter-drone briefings, investor and partner pitches, clinic and Koshari Bites decks, book talks. Use whenever Ali asks for an Arabic deck, Arabic slides, a bilingual presentation, «عرض تقديمي»، «بريزنتيشن بالعربي»، «شرائح», or says an existing deck's Arabic looks wrong (bullets on the left, punctuation at the wrong end, numbers flipped like "38%+", wrong font). Also use it to check any .pptx that contains Arabic before it is sent. Works alongside the pptx skill (which knows general PowerPoint editing) — this one owns everything about Arabic direction, fonts and layout in slides.
---

# Arabic RTL decks

A deck for a Kuwaiti bank, ministry or general must look like it was designed
in Arabic. Two things decide that: the **file mechanics** (PowerPoint needs
every Arabic paragraph marked RTL and every Arabic run given a complex-script
font — most tools set neither) and the **layout logic** (the eye starts at the
top-right, so the story, emphasis and order must start there).

## Choose the format

| Situation | Format |
|---|---|
| Will be emailed to a bank/ministry, edited by others, printed, or presented from their laptop | **PPTX** via `scripts/rtl_pptx.py` |
| Ali presents from his own screen / shares a link, wants motion | **Single-file HTML** (rules below) |
| An existing deck (from Gamma, Canva export, Google Slides, a consultant) | **Repair**: `rtl_pptx.py audit` then `fix` |

## The script

```bash
pip install python-pptx   # once
python3 <skill-dir>/scripts/rtl_pptx.py audit IN.pptx                 # find problems
python3 <skill-dir>/scripts/rtl_pptx.py fix IN.pptx OUT.pptx [--font "Cairo"]
python3 <skill-dir>/scripts/rtl_pptx.py build outline.json OUT.pptx    # new deck
```

- **audit** flags: Arabic paragraphs not marked RTL, left-aligned Arabic,
  Arabic runs with no complex-script font, letter-spacing on Arabic, mixed
  digit systems. Covers groups, tables and speaker notes.
- **fix** marks every Arabic paragraph RTL, right-aligns left-aligned ones,
  sets the Arabic font and lang `ar-KW`, strips letter-spacing on Arabic. It
  never touches Latin-only paragraphs.
- **build** makes a clean 16:9 deck from an outline. Schema:

```json
{
  "title": "…", "subtitle": "…", "presenter": "…",
  "font": "Cairo", "latin_font": "Inter",
  "accent": "C9A86A", "ink": "1A1A1A", "background": "FFFFFF", "title_background": "0E0D11",
  "slides": [
    {"type": "bullets", "title": "…", "bullets": ["…"], "notes": "…"},
    {"type": "stats", "title": "…", "stats": [{"value": "+38%", "label": "…"}]},
    {"type": "section", "title": "…"},
    {"type": "two_col", "title": "…", "first": {"heading": "…", "bullets": ["…"]},
                                    "second": {"heading": "…", "bullets": ["…"]}}
  ]
}
```
`first` is the right-hand column (read first). The first stat sits on the right.

After build or fix, **render and look** before delivering:
`soffice --headless --convert-to pdf OUT.pptx`, then view pages as images.
(If LibreOffice can't open files, install `libreoffice-impress`.) Check every
slide for: text starting on the right, bullets on the right, numbers and signs
intact (`+38%`, `1.9x`, `250,000 د.ك`), English terms in the right place
inside Arabic sentences, no □ boxes.

## Layout logic for RTL slides

- **Reading path starts top-right.** Title right-aligned; logo top-right or
  top-left consistently; the most important number/claim on the right.
- **Sequences run right→left:** timelines, process arrows, before→after
  (before on the right), comparison tables (our option in the first/right column).
- **Don't mirror:** charts' numeric axes, maps, logos, photos of people
  (unless a face looks off-slide), product shots, flags.
- **Numbers:** pick one system per deck. Western digits (1, 2, 3) are standard
  for business and finance decks in Kuwait and read best next to KWD figures;
  Arabic-Indic (١، ٢، ٣) suits formal ceremonial or government-letter-style
  slides. Never mix. KWD amounts: `250,000 د.ك` (or 3 decimals when fils matter).
- **Numbers inside Arabic sentences:** a signed or unit value (`+38%`,
  `-12%`, `3x`) inside an Arabic line can have its sign moved. Put it on its
  own line, or prefix with U+200E (LEFT-TO-RIGHT MARK) in the source text.
- **Fonts:** Ali's Arabic font is **Cairo** — use it for all Arabic, headings
  (Bold) and body (Regular), in every deck unless Ali asks otherwise or a
  brand skill (e.g. Koshari Bites) specifies its own. Latin: Inter. Avoid Arial/Calibri for Arabic — the result looks like
  a template. Cairo is free (Google Fonts) but often not installed on
  ministry/bank PCs — always send a PDF alongside the .pptx, or embed fonts
  (PowerPoint: Options → Save → Embed fonts).
- **Density:** Arabic runs ~20–25% longer than English. Cap bullets at ~4 per
  slide and ~12 words each; body ≥ 18pt; line spacing ≥ 1.2.
- **Terminology:** English acronyms the audience uses (MPW, KBAD, C-UAS, EBITDA,
  DSCR) can stay in Latin inside Arabic text — the script handles direction;
  give the Arabic term once on first use.

## Audience notes (Kuwait)

- **Banks** (credit facility requests): ask → purpose → repayment source →
  collateral → numbers. Lead with the ask in KWD on slide 2. Pair with the
  kuwait-bank-financing-cfo skill for the numbers.
- **Ministries / MPW:** formal MSA, titles correct, reference the tender number
  on the title slide, Arabic-Indic digits acceptable, no marketing tone.
- **Military (MoD / KBAD / National Guard):** capability → threat fit →
  integration → support/offset → timeline. Sober design, dark theme fine, no
  hype words. Pair with the anti-uav-laser-expert skill for content.
- **Brand decks (Koshari Bites, clinics):** follow that brand's skill for
  colours/fonts; this skill only governs direction and Arabic typography.

## HTML decks

Single self-contained file: `<html lang="ar" dir="rtl">`, Arabic font via
Google Fonts, English terms wrapped in `<span lang="en" dir="ltr">`, logical
CSS only (see arabic-rtl-web), keyboard: → goes to the **previous** slide and
← to the **next** in RTL (match the reading direction), progress bar fills
right→left. Test in a browser at 1280×720 before delivering.

## Credits

HTML-deck approach informed by [karem-arabic-presentation](https://github.com/karem505/karem-arabic-presentation)
(MIT). `rtl_pptx.py` is original.
