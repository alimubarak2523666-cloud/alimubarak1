#!/usr/bin/env python3
"""make_letter_docx - render a Kuwaiti official Arabic letter as a right-to-left Word file.

Usage:
    python make_letter_docx.py letter.json OUT.docx

letter.json fields (all text in Arabic unless noted):
    org               sender organisation name (header, right side)
    org_line2         optional second header line (department / CR no.)
    ref               reference number, e.g. "EVA/MPW/2026/045"   (digits converted if digits="arabic")
    date              ISO Gregorian date "2026-09-25" (Hijri is computed with hijridate / Umm al-Qura)
    hijri             optional override, e.g. "1448/04/03"   (use when the Kuwaiti calendar differs by a day)
    addressee_prefix  e.g. "السيد/" , "معالي/" , "سعادة/"
    addressee         e.g. "وكيل وزارة الأشغال العامة"
    addressee_suffix  default "المحترم"
    addressee_org     optional line under the addressee, e.g. "وزارة الأشغال العامة"
    subject           the subject line (without "الموضوع:")
    tender_no         optional, printed under the subject as "مناقصة رقم: …"
    greeting          default "تحية طيبة وبعد،"
    body              list of paragraphs
    closing           default "وتفضلوا بقبول فائق الاحترام والتقدير،،،"
    signer_name, signer_title
    attachments       optional list -> "المرفقات:"
    copies            optional list -> "نسخة إلى:"
    digits            "arabic" (١٢٣, default) or "western" for generated fields
    font              default "Cairo" (Ali's Arabic font); size default 13; line_spacing default 0.9 for Cairo, else 1.0

Requires: pip install python-docx hijridate
"""
import json
import re
import sys
from datetime import date

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt

AR_DIGITS = str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩")


LRE, PDF = "\u202a", "\u202c"  # left-to-right embedding, understood by Word and LibreOffice


def to_digits(s, mode):
    """Convert digits to Arabic-Indic, leaving any token that contains Latin letters
    (codes like S-104, EVA/MPW/2026) untouched so it stays readable."""
    if mode != "arabic":
        return s
    out = []
    for tok in re.split(r"(\s+)", s):
        out.append(tok if re.search(r"[A-Za-z]", tok) else tok.translate(AR_DIGITS))
    return "".join(out)


def ltr(s):
    """Keep a mixed Latin/number code in its written order inside RTL text."""
    return LRE + s + PDF if re.search(r"[A-Za-z]", s) else s


def dmy(iso_like):
    y, m, d = iso_like.replace("/", "-").split("-")
    return f"{int(d)}/{int(m)}/{y}"


def hijri_of(iso):
    try:
        from hijridate import Gregorian
    except ImportError:
        return None
    y, m, d = map(int, iso.split("-"))
    h = Gregorian(y, m, d).to_hijri()
    return f"{h.year}/{h.month:02d}/{h.day:02d}"


# ------------------------------------------------------------------ RTL helpers

def _el(tag, **attrs):
    e = OxmlElement(tag)
    for k, v in attrs.items():
        e.set(qn(k), v)
    return e


def rtl_paragraph(p):
    pPr = p._p.get_or_add_pPr()
    if pPr.find(qn("w:bidi")) is None:
        pPr.insert(0, _el("w:bidi"))
    return p


def rtl_run(run, font, size, bold=False):
    run.font.name = font
    run.font.size = Pt(size)
    run.bold = bold
    rPr = run._r.get_or_add_rPr()
    fonts = rPr.find(qn("w:rFonts"))
    if fonts is None:
        fonts = _el("w:rFonts")
        rPr.insert(0, fonts)
    for a in ("w:ascii", "w:hAnsi", "w:cs"):
        fonts.set(qn(a), font)
    if bold:
        rPr.append(_el("w:bCs"))
    rPr.append(_el("w:szCs", **{"w:val": str(int(size * 2))}))
    rPr.append(_el("w:rtl"))
    rPr.append(_el("w:lang", **{"w:bidi": "ar-KW"}))
    return run


LINE_SPACING = 1.0  # Arabic fonts (Cairo, Naskh) already carry a tall line gap


def add_par(container, text, font, size, bold=False, align=None, space_after=6, underline=False, keep_next=False):
    p = container.add_paragraph()
    rtl_paragraph(p)
    if align is not None:
        p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = LINE_SPACING
    p.paragraph_format.keep_with_next = keep_next
    if text:
        r = rtl_run(p.add_run(text), font, size, bold)
        r.underline = underline
    return p


def rtl_table(doc, widths_cm):
    """Borderless table whose first column sits on the right. Widths are fixed on
    the grid and on every cell; Word and LibreOffice ignore cell widths alone."""
    t = doc.add_table(rows=1, cols=len(widths_cm))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    tblPr = t._tbl.tblPr
    tblPr.append(_el("w:bidiVisual"))  # first column on the right
    tblPr.append(_el("w:tblLayout", **{"w:type": "fixed"}))
    for gc, w in zip(t._tbl.tblGrid.findall(qn("w:gridCol")), widths_cm):
        gc.set(qn("w:w"), str(int(Cm(w).twips)))
    for cell, w in zip(t.rows[0].cells, widths_cm):
        cell.width = Cm(w)
    return t


def _clear(cell):
    for p in list(cell.paragraphs):
        p._p.getparent().remove(p._p)


# ------------------------------------------------------------------ build

def build(spec, out):
    font = spec.get("font", "Cairo")
    size = float(spec.get("size", 13))
    global LINE_SPACING
    # Cairo's built-in line gap is very tall; 0.9 keeps a one-page letter on one page
    LINE_SPACING = float(spec.get("line_spacing", 0.9 if font == "Cairo" else LINE_SPACING))
    digits = spec.get("digits", "arabic")

    doc = Document()
    sec = doc.sections[0]
    sec.page_height, sec.page_width = Cm(29.7), Cm(21.0)
    sec.top_margin, sec.bottom_margin = Cm(3.5), Cm(2.5)   # room for pre-printed letterhead
    sec.right_margin, sec.left_margin = Cm(2.5), Cm(2.5)
    sec._sectPr.append(_el("w:bidi"))

    # header: org (right) | ref + dates (left)
    t = rtl_table(doc, [9, 7])
    right, left = t.rows[0].cells
    _clear(right); _clear(left)
    add_par(right, spec.get("org", ""), font, size, bold=True, space_after=0)
    if spec.get("org_line2"):
        add_par(right, spec["org_line2"], font, size - 2, space_after=0)
    if spec.get("ref"):
        add_par(left, "الرقم: " + ltr(to_digits(spec["ref"], digits)), font, size - 1, space_after=0)
    iso = spec.get("date") or date.today().isoformat()
    hij = spec.get("hijri") or hijri_of(iso)
    if hij:
        add_par(left, "التاريخ: " + to_digits(dmy(hij), digits) + " هـ", font, size - 1, space_after=0)
        add_par(left, "الموافق: " + to_digits(dmy(iso), digits) + " م", font, size - 1, space_after=0)
    else:
        add_par(left, "التاريخ: " + to_digits(dmy(iso), digits) + " م", font, size - 1, space_after=0)

    add_par(doc, "", font, size, space_after=4)

    # addressee
    # "السيد/ … " on the right, "المحترم" pushed to the left end of the same line
    line = f"{spec.get('addressee_prefix', 'السيد/')} {spec['addressee']}".strip()
    t = rtl_table(doc, [12.5, 3.5])
    a_cell, s_cell = t.rows[0].cells
    _clear(a_cell); _clear(s_cell)
    add_par(a_cell, line, font, size + 1, bold=True, space_after=0)
    if spec.get("addressee_org"):
        add_par(a_cell, spec["addressee_org"], font, size, space_after=0)
    add_par(s_cell, spec.get("addressee_suffix", "المحترم"), font, size + 1, bold=True,
            align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
    add_par(doc, "", font, size, space_after=6)

    add_par(doc, "السلام عليكم ورحمة الله وبركاته،", font, size, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_par(doc, "الموضوع: " + spec["subject"], font, size, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER,
            underline=True, space_after=2)
    if spec.get("tender_no"):
        add_par(doc, "مناقصة رقم: " + ltr(to_digits(spec["tender_no"], digits)), font, size, bold=True,
                align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    add_par(doc, spec.get("greeting", "تحية طيبة وبعد،"), font, size, space_after=8)

    for para in spec.get("body", []):
        # start-aligned, not justified: Arabic justification stretches words with kashida
        p = add_par(doc, to_digits(para, digits), font, size, space_after=6)
        p.paragraph_format.first_line_indent = Cm(1)

    add_par(doc, spec.get("closing", "وتفضلوا بقبول فائق الاحترام والتقدير،،،"), font, size,
            align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)

    # signature on the left (end) side
    t = rtl_table(doc, [8, 8])
    _, sig = t.rows[0].cells
    _clear(sig)
    add_par(sig, spec.get("signer_name", ""), font, size, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
    add_par(sig, spec.get("signer_title", ""), font, size, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
    add_par(sig, "", font, size, space_after=14)  # room for signature and stamp
    _clear(t.rows[0].cells[0])
    add_par(t.rows[0].cells[0], "", font, size)

    small = size - 3
    if spec.get("attachments"):
        add_par(doc, "", font, small, space_after=6)
        add_par(doc, "المرفقات:", font, small, bold=True, space_after=0, keep_next=True)
        for i, a in enumerate(spec["attachments"], 1):
            add_par(doc, f"{to_digits(str(i), digits)}- {to_digits(a, digits)}", font, small, space_after=0)
    if spec.get("copies"):
        add_par(doc, "", font, small, space_after=4)
        add_par(doc, "نسخة إلى:", font, small, bold=True, space_after=0, keep_next=True)
        for c in spec["copies"]:
            add_par(doc, "- " + c, font, small, space_after=0)

    doc.save(out)
    note = hij or "n/a - install hijridate or pass a 'hijri' field"
    print(f"make_letter_docx: wrote {out} (Hijri {note})")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    build(json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2])
