---
name: kuwait-gov-correspondence
description: Drafts official Arabic letters (كتب رسمية / خطابات رسمية) from Ali's companies to Kuwaiti government bodies, banks and official partners — Ministry of Public Works (MPW / وزارة الأشغال العامة), Central Agency for Public Tenders (CAPT / الجهاز المركزي للمناقصات العامة), Ministry of Defense, Kuwait Army / KBAD, National Guard, Ministry of Health, municipalities, KDIPA, banks — and outputs a print-ready right-to-left Word (.docx) file. Use for tender clarification requests (استيضاح), bid cover letters (خطاب تقديم العطاء), extension requests (طلب تمديد), objections/grievances (تظلم), meeting requests, letters of introduction, authorisation letters (تفويض), bank facility requests, guarantee letters correspondence, replies to official letters, and follow-ups. Trigger on «كتاب رسمي»، «خطاب للوزارة»، «اكتب رسالة للأشغال»، «رد على كتاب»، «طلب استيضاح»، «خطاب تغطية العطاء», "official letter", "letter to the ministry", "write to MPW/MoD/the bank", even when Ali only pastes the ministry's letter and says "reply to this".
---

# Kuwait official correspondence

An official letter in Kuwait is judged in the first three lines: correct
addressee title, a clear subject, and a reference the recipient's registry can
file. After that it must be brief, precise and courteous — ministries read
hundreds of these. This skill produces the text *and* a right-to-left Word
file ready for the company letterhead.

## What to collect first

Ask only for what is missing and can't be inferred:

1. **Sender** — which company (EVA Integrated Co., Ali Abdullah Mubarak Co.,
   Koshari Bites, The National Incubator…), signer name and title.
2. **Recipient** — body, department, and the **position** addressed. Use the
   position, not a personal name, unless Ali gives the name. Never guess a
   current office-holder's name.
3. **Subject + reference points** — tender number, the recipient's letter
   number and date being answered, contract number.
4. **The ask** — exactly what the recipient should do, and by when.
5. **Attachments and copies** (نسخة إلى).
6. **Digits** — Arabic-Indic (١٢٣, default for government letters) or Western.

## Structure (fixed order)

1. Header: sender name (right) · الرقم / التاريخ (هجري) / الموافق (ميلادي) (left)
2. Addressee: `السيد/ [المنصب] ... المحترم` (+ organisation line)
3. `السلام عليكم ورحمة الله وبركاته،` (centred)
4. `الموضوع: …` (centred, bold, underlined) + `مناقصة رقم: …` if relevant
5. `تحية طيبة وبعد،`
6. Body — see rules
7. `وتفضلوا بقبول فائق الاحترام والتقدير،،،` (centred)
8. Signature block (left side): name, title, space for signature and stamp
9. `المرفقات:` numbered · `نسخة إلى:`

## Body rules

- **Paragraph 1 — the reference.** «بالإشارة إلى كتابكم رقم (…) بتاريخ … بشأن …»
  or «بالإشارة إلى المناقصة المذكورة أعلاه…». This is how the registry links
  the letter to the file.
- **Paragraph 2..n — the substance.** One point per paragraph; number points
  with أولاً/ثانياً/ثالثاً. Cite clause/drawing/BoQ item numbers exactly.
  State facts, not feelings.
- **Last paragraph — the ask.** «لذا، نأمل التكرم بـ… » with a date if there is a
  deadline («وذلك قبل الموعد المحدد لتقديم العطاءات في …»).
- Formal MSA only. Courtesy formulas are expected here («نأمل التكرم»،
  «نود الإفادة») — unlike UI copy — but one per paragraph at most.
- No Fix-level calques («قام بـ»، «تم + مصدر» chains, «من قِبل», «حيث أنّ») — see
  the calques reference in the arabic-kuwaiti-writer skill.
- Keep to one page where possible. If it overflows, cut words before shrinking
  the font.
- Tenders: never disclose price information in a clarification letter; never
  concede a deviation in writing unless Ali approved it; for objections cite
  the article of the tender conditions or of the Public Tenders Law being
  relied on, and flag that timing rules for grievances must be checked
  against the tender documents (don't state a deadline from memory).

## Addressing

Read `references/addressing.md` for titles by position (أمير، ولي عهد، رئيس
مجلس الوزراء، وزير، وكيل، مدير، military ranks, bank officials). When the
recipient has written to Ali before, mirror the form used in *their*
letterhead and signature — that is always safest.

## Producing the Word file

```bash
pip install python-docx hijridate   # once
python3 <skill-dir>/scripts/make_letter_docx.py letter.json OUT.docx
```

The JSON fields are documented at the top of the script. It handles:
right-to-left section and paragraphs, Arabic complex-script font on every run
(default Simplified Arabic 14 — standard in Kuwaiti government offices),
header table with reference + Hijri (Umm al-Qura via hijridate) + Gregorian
dates in day/month/year, «المحترم» at the line end, signature block on the
left, attachments and copies, Arabic-Indic digits in body text while leaving
Latin codes (S-104, EVA/MPW/2026/045) in their written order, and a 3.5 cm top
margin for pre-printed letterhead.

**The Hijri date is computed, and Kuwait's official calendar can differ by
one day.** Show Ali the Hijri date in your reply and let him override it with
the `"hijri"` field.

After generating: convert to PDF (`soffice --headless --convert-to pdf`) and
look at the page before delivering — check the reference number isn't
scrambled, المحترم sits at the left end, nothing spills onto a second page,
and no □ boxes. Deliver the .docx (for letterhead printing and stamping) and
mention the PDF preview.

## Templates

`references/letter-types.md` has ready body text for the common letters:
tender clarification, bid cover letter, extension request, grievance,
meeting request, reply to an official letter, introduction/prequalification,
authorisation, bank facility request, follow-up/reminder. Adapt; don't paste
blindly.
