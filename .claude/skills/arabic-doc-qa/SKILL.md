---
name: arabic-doc-qa
description: Pre-flight quality check for any PDF or Word (.docx) file that contains Arabic, before it is printed, sent or published — catches missing-glyph boxes (□ tofu), Arabic letters that are not joined, text stored or displayed backwards, Latin-only fonts used for Arabic, fonts not embedded, paragraphs not set right-to-left, letter-spacing that breaks Arabic, mixed ١٢٣/123 digits, Latin , ; ? inside Arabic, and common spelling slips (ه/ة, missing hamza). Use it as the last step whenever Ali produces or receives an Arabic document — ministry and MPW letters, tender submissions, bank facility packs, the Arabic book «تزوّج الحكومة» print PDF, clinic consent forms and price lists, menus, proposals — and whenever he asks "is this ready?", "check the Arabic", "why does the Arabic look broken?", «راجع الملف قبل الطباعة», «الحروف مقطعة», «مربعات بدل الحروف». Extends the Koshari Bites rule — no missing-glyph boxes ever ship — to every Arabic document.
---

# Arabic document QA

Arabic breaks in documents in ways an English-speaking toolchain doesn't
notice: a font without Arabic draws boxes, a generator that doesn't shape text
leaves letters unjoined, a pipeline that doesn't do bidi stores text reversed,
and a Word paragraph without the RTL flag puts punctuation at the wrong end.
Any of these in a letter to a ministry or a bank pack costs credibility. The
check has two halves — an automatic scan and a visual look — and both are
needed: the scan finds what eyes miss (reversed storage, unembedded fonts), the
eyes find what the scan can't (a number flipped inside a sentence, an awkward
line break).

## Run it

```bash
pip install pymupdf python-docx      # once
python3 <skill-dir>/scripts/arabic_doc_qa.py FILE [FILE…] --render <outdir>
python3 <skill-dir>/scripts/arabic_doc_qa.py FILE --json           # for scripting
```

`--render` saves every page as PNG (DOCX goes through LibreOffice first; if
it fails, install `libreoffice-writer`). Exit code is 1 when any error is found.

## What it checks

| Code | Level | Meaning | Usual fix |
|---|---|---|---|
| `tofu` | error | Arabic drawn with a missing glyph (□) | use a font with Arabic (IBM Plex Sans Arabic, Noto Naskh Arabic, Simplified Arabic, Amiri) and re-export |
| `unjoined` / `letters-apart` | error | letters not connected | the generator doesn't shape Arabic — export from Word/InDesign/LibreOffice, or shape properly; remove letter-spacing |
| `reversed` | error | text stored backwards (common words appear mirrored) | the PDF was built without bidi — regenerate with a tool that handles RTL |
| `latin-font` | error | Arabic set in Inter, Playfair, Calibri, etc. | set the complex-script font (Word: Font → Complex scripts) |
| `no-bidi` | error | Word paragraph not right-to-left | Paragraph → Right-to-left, or `w:bidi` |
| `letter-spacing` | error | tracking on Arabic runs | remove character spacing |
| `not-embedded` | warn | font not embedded in PDF | export PDF with fonts embedded (PDF/X for print) |
| `mixed-digits` | warn | ١٢٣ and 123 in the same paragraph (Latin codes like S-104 are ignored) | pick one system per document |
| `latin-punct` | warn | , ; ? beside Arabic | ، ؛ ؟ |
| `spelling` | warn | unambiguous slips (الى→إلى، شركه→شركة، اهمية→أهمية) | fix |
| `tatweel` | warn | stretched words (ـــ) | usually justification; switch to right alignment or fix kashida settings |
| `pre-shaped` | info | text stored as presentation forms | fine visually; search/copy/accessibility suffer |
| `justified` | info | justified Arabic in Word | check for ugly kashida in the render |
| `font-not-here` | info | font not installed on this machine | can't verify coverage; ensure the printer/recipient has it or embed |

## Then look

Open every rendered page image and check what the scan can't:

1. **Direction** — text starts on the right; bullets and numbering on the right.
2. **Numbers in sentences** — `+38%`, `-12%`, ranges `3-5`, dates and KWD amounts
   read correctly (signs not jumped to the other end).
3. **Mixed English terms** — Latin words sit in the correct place in the Arabic
   sentence; parentheses not flipped `)like this(`.
4. **Typography** — no boxes, no gaps inside words, no word stretched with ـ,
   Arabic not in a different font than intended, line spacing not clipping
   dots/diacritics.
5. **Print specifics** (books, banners) — RTL binding side, gutter on the
   correct side, page numbers on the outer edge; pair with the
   book-layout-print-production skill.

## Report format

```
arabic-doc-qa — <file> — <READY | FIX FIRST>
❌ <page/paragraph>  <problem>  → <specific fix>
⚠️ …
✅ direction, numbers, fonts, joining checked on N pages
```
List errors first. Say plainly whether the file is ready to send. When you
also produced the file, fix the errors yourself and re-run before reporting;
don't hand Ali a checklist of your own bugs.

## Limits

- Spelling covers a short list of unambiguous words only — it's a net for
  machine-drafted slips, not a proofreader. Use arabic-kuwaiti-writer or
  arabic-book-audit-master for language review.
- Scanned PDFs have no text layer; only the visual check applies.
- `reversed` is a heuristic based on common words; very short Arabic texts
  (< ~10 words) may not trigger it — the visual check covers them.
