#!/usr/bin/env python3
"""arabic_doc_qa - pre-flight check for Arabic in PDF and Word (.docx) files.

Finds the problems that make Arabic documents look broken or unprofessional:
missing-glyph boxes (tofu), letters that are not joined, text stored in
reverse order, fonts without Arabic, paragraphs not marked right-to-left,
letter-spacing on Arabic, mixed digit systems, Latin punctuation inside Arabic,
and common spelling slips.

Usage:
    python arabic_doc_qa.py FILE [FILE ...] [--render DIR] [--json]

    --render DIR   also save every page as PNG into DIR for visual review
                   (DOCX is converted with LibreOffice first)
    --json         machine-readable output

Exit code 1 when any error is found.
Requires: pip install pymupdf python-docx   (LibreOffice for --render on DOCX)
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile

AR = re.compile(r"[؀-ۿݐ-ݿࢠ-ࣿ]")
AR_ANY = re.compile(r"[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]")
PRES_FORMS = re.compile(r"[ﭐ-﷿ﹰ-﻿]")
AR_WORD = re.compile(r"[ء-ي٠-٩ٮ-ۓۺ-ۿ]+")

# Presentation Forms-B: each letter has isolated/final/initial/medial variants.
# Build the set of *isolated* codepoints so we can tell "shaped" from "stuck apart".
_ISO = {0xFE80, 0xFE81, 0xFE83, 0xFE85, 0xFE87, 0xFE89, 0xFE8D, 0xFE8F, 0xFE93, 0xFE95,
        0xFE99, 0xFE9D, 0xFEA1, 0xFEA5, 0xFEA9, 0xFEAB, 0xFEAD, 0xFEAF, 0xFEB1, 0xFEB5,
        0xFEB9, 0xFEBD, 0xFEC1, 0xFEC5, 0xFEC9, 0xFECD, 0xFED1, 0xFED5, 0xFED9, 0xFEDD,
        0xFEE1, 0xFEE5, 0xFEE9, 0xFEED, 0xFEEF, 0xFEF1, 0xFEF5, 0xFEF7, 0xFEF9, 0xFEFB}

COMMON = ["في", "من", "على", "إلى", "أن", "التي", "الذي", "هذا", "هذه", "مع", "عن", "كان", "بين", "كما", "وقد"]
COMMON_SET = set(COMMON)
REVERSED_SET = {w[::-1] for w in COMMON} - COMMON_SET

# unambiguous spelling slips → correction (only words with a single correct reading)
SPELLING = {
    "انشاء": "إنشاء", "اهمية": "أهمية", "الى": "إلى", "ايضا": "أيضًا", "اكثر": "أكثر",
    "امكانية": "إمكانية", "اساسي": "أساسي", "اجراء": "إجراء", "اجراءات": "إجراءات",
    "ادارة": "إدارة", "اضافة": "إضافة", "انجاز": "إنجاز", "اطار": "إطار", "افادة": "إفادة",
    "بعنايه": "بعناية", "مدينه": "مدينة", "شركه": "شركة", "مؤسسه": "مؤسسة", "الشركه": "الشركة",
    "الكويتيه": "الكويتية", "العامه": "العامة", "رساله": "رسالة", "خدمه": "خدمة",
}

LATIN_ONLY_FONTS = {"inter", "playfair display", "calibri", "cambria", "helvetica", "helvetica neue",
                    "georgia", "garamond", "montserrat", "roboto", "open sans", "lato", "poppins",
                    "instrument serif", "gloock", "outfit", "futura", "gill sans"}


class Report:
    def __init__(self, path):
        self.path = path
        self.items = []

    def add(self, level, code, msg, where="", sample=""):
        self.items.append({"level": level, "code": code, "msg": msg, "where": where, "sample": sample[:60]})

    @property
    def errors(self):
        return sum(1 for i in self.items if i["level"] == "error")


# ---------------------------------------------------------------- text-level checks

def text_checks(rep, text, where):
    if not AR.search(text):
        return
    # digits inside Latin codes (S-104, EVA/MPW/2026/045, ISO 9001) are intentional; ignore them
    plain = " ".join(t for t in text.split() if not re.search(r"[A-Za-z]", t))
    west = re.findall(r"[0-9]", plain)
    east = re.findall(r"[٠-٩]", plain)
    if west and east:
        rep.add("warn", "mixed-digits", f"mixes Western ({len(west)}) and Arabic-Indic ({len(east)}) digits", where)
    for m in re.finditer(r"[؀-ۿ]\s?[,;?](?=\s|$)", text):
        rep.add("warn", "latin-punct", "Latin , ; ? next to Arabic — use ، ؛ ؟", where, text[max(0, m.start() - 15):m.end() + 5])
        break
    if re.search(r'"[^"]*[؀-ۿ][^"]*"', text):
        rep.add("info", "straight-quotes", 'straight quotes around Arabic — prefer «»', where)
    if "ــ" in text:
        rep.add("warn", "tatweel", "stretched words with tatweel (ـ) — usually from justification or decoration", where)
    slips = sorted({w for w in AR_WORD.findall(text) if w in SPELLING})
    if slips:
        rep.add("warn", "spelling", "spelling: " + "، ".join(f"«{w}» → «{SPELLING[w]}»" for w in slips), where)


def order_check(rep, words, where):
    fwd = sum(1 for w in words if w in COMMON_SET)
    rev = sum(1 for w in words if w in REVERSED_SET)
    if rev >= 3 and rev > fwd:
        rep.add("error", "reversed", f"Arabic appears stored in reverse order ({rev} reversed common words vs {fwd} normal) — copy/search/screen readers get gibberish; often also displays backwards", where)


# ---------------------------------------------------------------- PDF

def check_pdf(path, rep):
    import pymupdf
    doc = pymupdf.open(path)
    font_ar = {}
    all_words = []
    for pno, page in enumerate(doc, 1):
        where = f"p.{pno}"
        tofu = 0
        pres = iso = 0
        try:
            traces = page.get_texttrace()
        except Exception:
            traces = []
        for span in traces:
            fname = span.get("font", "?")
            for ch in span.get("chars", []):
                uni, gid = ch[0], ch[1]
                c = chr(uni) if uni > 0 else ""
                if AR_ANY.search(c or "") or uni == 0xFFFD:
                    font_ar.setdefault(fname, 0)
                    font_ar[fname] += 1
                    if gid == 0 or uni == 0xFFFD:
                        tofu += 1
                if 0xFB50 <= uni <= 0xFEFF:
                    pres += 1
                    if uni in _ISO:
                        iso += 1
        if tofu:
            rep.add("error", "tofu", f"{tofu} Arabic character(s) drawn with a missing glyph (□) — the font has no Arabic", where)
        if pres:
            ratio = iso / pres
            if ratio > 0.6 and pres > 20:
                rep.add("error", "unjoined", f"{int(ratio*100)}% of Arabic letters are isolated forms — letters are not joined", where)
            else:
                rep.add("info", "pre-shaped", "text stored as presentation forms (pre-shaped) — looks fine but search/copy/accessibility suffer", where)
        text = page.get_text()
        words = AR_WORD.findall(text)
        all_words += words
        # unjoined letters also show up as long runs of single Arabic letters separated by spaces
        singles = re.findall(r"(?:(?<=\s)|^)[ء-ي](?=\s)", text)
        if len(singles) > 25 and len(singles) > 0.4 * max(1, len(words)):
            rep.add("error", "letters-apart", "many single Arabic letters separated by spaces — letter-spacing or broken shaping", where)
        order_check(rep, words, where)
        text_checks(rep, text, where)
    for f, n in font_ar.items():
        base = f.split("+")[-1].split("-")[0].lower()
        if any(base.startswith(l.replace(" ", "")) for l in LATIN_ONLY_FONTS):
            rep.add("error", "latin-font", f"Arabic set in a Latin-only font «{f}» ({n} chars)")
    for pno in range(len(doc)):
        for f in doc.get_page_fonts(pno):
            ext, name = f[1], f[3]
            if ext in ("n/a", "") and name in font_ar:
                rep.add("warn", "not-embedded", f"font «{name}» used for Arabic is not embedded — printer may substitute it", f"p.{pno+1}")
    if not all_words and not font_ar:
        has_text = any(page.get_text().strip() for page in doc)
        if has_text:
            rep.add("info", "no-arabic", "this file contains no Arabic text — nothing Arabic to check")
        else:
            rep.add("info", "no-text", "no extractable text (scanned image, or text converted to outlines) — review the rendered pages visually")
    return doc


# ---------------------------------------------------------------- DOCX

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def _installed_arabic_fonts():
    try:
        out = subprocess.run(["fc-list", ":lang=ar", "family"], capture_output=True, text=True, timeout=20).stdout
        return {f.strip().lower() for line in out.splitlines() for f in line.split(",")}
    except Exception:
        return None


def check_docx(path, rep):
    from lxml import etree
    z = zipfile.ZipFile(path)
    parts = [n for n in z.namelist() if re.match(r"word/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$", n)]
    styles = etree.fromstring(z.read("word/styles.xml")) if "word/styles.xml" in z.namelist() else None
    default_cs = None
    if styles is not None:
        rf = styles.find(f".//{W}docDefaults//{W}rFonts")
        if rf is not None:
            default_cs = rf.get(f"{W}cs")
    installed = _installed_arabic_fonts()
    fonts_used = {}
    all_words = []
    for part in parts:
        root = etree.fromstring(z.read(part))
        label = part.split("/")[-1].replace(".xml", "")
        for i, p in enumerate(root.iter(f"{W}p"), 1):
            text = "".join(t.text or "" for t in p.iter(f"{W}t"))
            if not AR.search(text):
                continue
            where = f"{label} ¶{i}"
            pPr = p.find(f"{W}pPr")
            bidi = pPr is not None and pPr.find(f"{W}bidi") is not None
            if not bidi:
                rep.add("error", "no-bidi", "Arabic paragraph not set right-to-left (w:bidi) — starts on the left, punctuation lands at the wrong end", where, text)
            jc = pPr.find(f"{W}jc") if pPr is not None else None
            if jc is not None and jc.get(f"{W}val") in ("both", "distribute"):
                rep.add("info", "justified", "justified Arabic — Word may stretch words with kashida; check the rendering", where, text)
            for r in p.iter(f"{W}r"):
                rt = "".join(t.text or "" for t in r.iter(f"{W}t"))
                if not AR.search(rt):
                    continue
                rPr = r.find(f"{W}rPr")
                rf = rPr.find(f"{W}rFonts") if rPr is not None else None
                cs = (rf.get(f"{W}cs") if rf is not None else None) or default_cs
                if cs:
                    fonts_used[cs] = fonts_used.get(cs, 0) + 1
                else:
                    fonts_used["(theme/default)"] = fonts_used.get("(theme/default)", 0) + 1
                sp = rPr.find(f"{W}spacing") if rPr is not None else None
                if sp is not None and sp.get(f"{W}val") not in (None, "0"):
                    rep.add("error", "letter-spacing", "letter-spacing on Arabic pulls joined letters apart", where, rt)
            all_words += AR_WORD.findall(text)
            text_checks(rep, text, where)
    for f, n in fonts_used.items():
        low = f.lower()
        if low in LATIN_ONLY_FONTS:
            rep.add("error", "latin-font", f"Arabic runs use «{f}», which has no Arabic — Word will substitute a fallback font ({n} runs)")
        elif installed is not None and f != "(theme/default)" and low not in installed:
            rep.add("info", "font-not-here", f"Arabic font «{f}» isn't installed on this machine — can't verify its coverage here; make sure the printer/recipient has it or export PDF with embedded fonts ({n} runs)")
    order_check(rep, all_words, "document")


# ---------------------------------------------------------------- render

def render(path, outdir):
    import pymupdf
    os.makedirs(outdir, exist_ok=True)
    pdf = path
    if path.lower().endswith(".docx"):
        soffice = shutil.which("soffice") or shutil.which("libreoffice")
        if not soffice:
            return "LibreOffice not found — cannot render DOCX"
        tmp = tempfile.mkdtemp()
        subprocess.run([soffice, "--headless", "--convert-to", "pdf", "--outdir", tmp, path],
                       capture_output=True, timeout=300)
        pdf = os.path.join(tmp, os.path.splitext(os.path.basename(path))[0] + ".pdf")
        if not os.path.exists(pdf):
            return "LibreOffice could not convert the DOCX (install libreoffice-writer)"
    doc = pymupdf.open(pdf)
    stem = os.path.splitext(os.path.basename(path))[0]
    for i, page in enumerate(doc, 1):
        page.get_pixmap(dpi=110).save(os.path.join(outdir, f"{stem}-p{i}.png"))
    return f"rendered {len(doc)} page(s) to {outdir}"


# ---------------------------------------------------------------- main

ICON = {"error": "❌", "warn": "⚠️ ", "info": "ℹ️ "}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+")
    ap.add_argument("--render")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    reports = []
    for f in a.files:
        rep = Report(f)
        low = f.lower()
        try:
            if low.endswith(".pdf"):
                check_pdf(f, rep)
            elif low.endswith(".docx"):
                check_docx(f, rep)
            else:
                rep.add("error", "unsupported", "only .pdf and .docx are supported")
        except Exception as e:
            rep.add("error", "crash", f"could not read file: {e}")
        if a.render and low.endswith((".pdf", ".docx")):
            rep.render = render(f, a.render)
        reports.append(rep)
    if a.json:
        print(json.dumps([{"file": r.path, "errors": r.errors, "items": r.items,
                           "render": getattr(r, "render", None)} for r in reports], ensure_ascii=False, indent=2))
    else:
        for r in reports:
            print(f"\n== {r.path}")
            seen = set()
            for it in r.items:
                key = (it["code"], it["where"])
                if key in seen:
                    continue
                seen.add(key)
                s = f"  «{it['sample']}»" if it["sample"] else ""
                w = f"{it['where']:<14}" if it["where"] else " " * 14
                print(f"{ICON[it['level']]} {w} {it['msg']}{s}")
            if not r.items:
                print("✅ no Arabic problems found by the automatic checks")
            if getattr(r, "render", None):
                print(f"🖼  {r.render} — now look at the pages")
            print(f"   {r.errors} error(s), {sum(1 for i in r.items if i['level']=='warn')} warning(s)")
    sys.exit(1 if any(r.errors for r in reports) else 0)


if __name__ == "__main__":
    main()
