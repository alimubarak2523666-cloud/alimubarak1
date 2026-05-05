"""Build the Audit Checklist PDF for alimubarak1.com — page-by-page review."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# Brand palette
EMERALD = HexColor('#0e4a3e')
EMERALD_DEEP = HexColor('#0a3329')
GOLD = HexColor('#a17b3a')
CREAM = HexColor('#faf6ee')
SAND = HexColor('#e8dcc4')
INK = HexColor('#3a3a36')
INK_MUTED = HexColor('#8b7d5f')
BORDER = HexColor('#d4cdb8')

# Doc setup
OUT = '/sessions/eloquent-dazzling-ramanujan/mnt/ali mubarak website/Audit-Checklist-2026-04-27.pdf'
doc = SimpleDocTemplate(
    OUT,
    pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm,
    topMargin=18*mm, bottomMargin=18*mm,
    title='Audit Checklist · alimubarak1.com',
    author='Ali Abdullah Mubarak',
)

styles = getSampleStyleSheet()

eyebrow = ParagraphStyle('Eyebrow', parent=styles['Normal'],
    fontName='Helvetica', fontSize=8, textColor=GOLD, spaceAfter=4,
    leading=10, alignment=TA_LEFT)

h1 = ParagraphStyle('H1', parent=styles['Heading1'],
    fontName='Times-Bold', fontSize=26, textColor=EMERALD, spaceBefore=0,
    spaceAfter=8, leading=30, alignment=TA_LEFT)

h2 = ParagraphStyle('H2', parent=styles['Heading2'],
    fontName='Times-Bold', fontSize=18, textColor=EMERALD, spaceBefore=14,
    spaceAfter=8, leading=22, alignment=TA_LEFT)

h3 = ParagraphStyle('H3', parent=styles['Heading3'],
    fontName='Times-Bold', fontSize=13, textColor=EMERALD_DEEP, spaceBefore=10,
    spaceAfter=4, leading=16, alignment=TA_LEFT)

intro = ParagraphStyle('Intro', parent=styles['Normal'],
    fontName='Helvetica', fontSize=10, textColor=INK, leading=15, spaceAfter=4)

body = ParagraphStyle('Body', parent=styles['Normal'],
    fontName='Helvetica', fontSize=9.5, textColor=INK, leading=13, spaceAfter=2)

state = ParagraphStyle('State', parent=styles['Normal'],
    fontName='Helvetica-Oblique', fontSize=8.5, textColor=INK_MUTED, leading=11, spaceAfter=0)

footer_italic = ParagraphStyle('FooterItalic', parent=styles['Normal'],
    fontName='Times-Italic', fontSize=9, textColor=INK_MUTED, leading=12,
    alignment=TA_CENTER)

CHECKBOX = '<font name="Helvetica" size="14" color="#0e4a3e">&#9744;</font>'  # ☐


def gold_rule():
    return HRFlowable(width=20*mm, thickness=1, color=GOLD, spaceBefore=2, spaceAfter=4)


def section_break():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceBefore=8, spaceAfter=4)


def page_header(eyebrow_text, title_text, sub_text=None):
    parts = [
        gold_rule(),
        Paragraph(eyebrow_text.upper(), eyebrow),
        Paragraph(title_text, h1),
    ]
    if sub_text:
        parts.append(Paragraph(sub_text, intro))
    parts.append(section_break())
    return parts


def item(title, current_state, note_lines=2):
    """One audit item with checkbox, title, current-state line, and N note lines."""
    title_p = Paragraph(f'{CHECKBOX} &nbsp;&nbsp;<b>{title}</b>', body)
    state_p = Paragraph(f'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {current_state}', state)
    rows = [[title_p], [state_p]]
    for _ in range(note_lines):
        rows.append([Paragraph('<font color="#d4cdb8">______________________________________________________________________________________________</font>', state)])
    t = Table(rows, colWidths=[174*mm])
    t.setStyle(TableStyle([
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 1),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 4),
        ('BOTTOMPADDING', (0, 2), (-1, -1), 6),
    ]))
    return KeepTogether([t, Spacer(1, 4*mm)])


def notes_block(lines=8):
    """Block of empty lines for free-form notes."""
    rows = []
    for _ in range(lines):
        rows.append([Paragraph('<font color="#d4cdb8">______________________________________________________________________________________________</font>', state)])
    t = Table(rows, colWidths=[174*mm])
    t.setStyle(TableStyle([
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    return t


story = []

# ===================== COVER =====================
story.append(Spacer(1, 30*mm))
story.append(gold_rule())
story.append(Paragraph('AUDIT CHECKLIST', eyebrow))
story.append(Paragraph('alimubarak1.com', h1))
story.append(Paragraph('A page-by-page review of every gap on the live site.<br/>Tick what to do. Add notes. Bring it to our next session.', intro))
story.append(Spacer(1, 8*mm))

cover_meta = Table([
    [Paragraph('<b>Live URL</b>', body), Paragraph('alimubarak1.netlify.app', body)],
    [Paragraph('<b>Custom domain</b>', body), Paragraph('alimubarak1.com (DNS pending)', body)],
    [Paragraph('<b>Repo</b>', body), Paragraph('github.com/alimubarak2523666-cloud/alimubarak1', body)],
    [Paragraph('<b>Date</b>', body), Paragraph('27 April 2026', body)],
    [Paragraph('<b>Direction</b>', body), Paragraph('B — Cultured Gulf Executive (emerald · cream · gold)', body)],
    [Paragraph('<b>Status</b>', body), Paragraph('Live · 5 tabs · Bilingual EN/AR · Photos and book cover loaded', body)],
], colWidths=[35*mm, 139*mm])
cover_meta.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('BACKGROUND', (0, 0), (-1, -1), CREAM),
    ('LINEBELOW', (0, 0), (-1, -2), 0.4, BORDER),
    ('ROWBACKGROUNDS', (0, 0), (-1, -1), [CREAM, HexColor('#fbf8f2')]),
]))
story.append(cover_meta)
story.append(Spacer(1, 20*mm))
story.append(Paragraph('Six pages of the site. Tick what you want done.<br/>Cross-cutting items at the end.<br/>Free notes pages at the back.', footer_italic))
story.append(PageBreak())

# ===================== HOMEPAGE =====================
story += page_header('Page 1 of 6', 'Homepage', 'alimubarak1.netlify.app/en  ·  /ar')
story.append(Paragraph('What works today', h3))
story.append(Paragraph('• Hero photo loads · headline · tagline · two CTAs (Work with Ali, Read the book)<br/>• Top nav: 5 tabs + EN ⇄ ع toggle<br/>• Footer: copyright + Kuwait · 2035 italic strip<br/>• Bilingual: clicking ع flips entire site to RTL', body))
story.append(Spacer(1, 4*mm))
story.append(Paragraph('Gaps to decide on', h3))
story.append(item('Add a contact line to the footer', 'Currently footer = copyright + tagline only. Add: ali@alimubarak1.com · @alimubarak1 · phone? · location?'))
story.append(item('Add a social icon strip in the footer', 'Instagram, X, TikTok, YouTube, Snapchat — small icons, single row.'))
story.append(item('Add a "featured" strip below the hero', 'Currently homepage = just the hero, then footer. Could add: 4 ventures grid + book feature + latest podcast/TV.', note_lines=3))
story.append(item('Swap formal navy-suit portrait for English version', 'Currently both EN and AR show the warm Khaleeji portrait. The formal navy-suit one was sent in chat but never saved to /public.'))
story.append(item('Tagline rewrite?', 'Current: "I build companies, advise executives, and bridge government and private sector across Kuwait and the GCC." Want different words?', note_lines=3))
story.append(PageBreak())

# ===================== ABOUT =====================
story += page_header('Page 2 of 6', 'About — 9 sections', 'alimubarak1.netlify.app/en/about')

story.append(Paragraph('Section 1 · Intro band', h3))
story.append(item('Photo on intro band', 'Now showing real photo (was AM placeholder until tonight\'s push).'))
story.append(item('Tagline under name', 'Current: "Twenty-five years of building companies, advising executives, and bridging government and private sector across Kuwait and the GCC."', note_lines=2))

story.append(Paragraph('Section 2 · The Story', h3))
story.append(item('"A mechanical engineer who became an operator." — 2 paragraphs', 'Locked. Mentions Schlumberger, KNPC, KPC, IPG, then today\'s 4 ventures + the book.', note_lines=3))

story.append(Paragraph('Section 3 · What I Do Today', h3))
story.append(item('Four venture cards (EVA, Koshari Bites, AMC, TNI)', 'Each card links to its detail page. Locked.'))

story.append(Paragraph('Section 4 · Public Service', h3))
story.append(item('4 government committees + Kuwait Oil Tanker State Award', 'Text only. Want to add photos with ministers / committee certificates?', note_lines=3))

story.append(Paragraph('Section 5 · Career Journey', h3))
story.append(item('Timeline of past roles (ACK, IPG, KPC, KNPC, Schlumberger)', 'Locked. Want company logos beside each role?', note_lines=2))

story.append(Paragraph('Section 6 · Education', h3))
story.append(item('Maastricht MBA + Gannon BS', 'Locked. Want diploma scans / university crests?', note_lines=2))

story.append(Paragraph('Section 7 · Writing & Voice', h3))
story.append(item('Book card: "Get Married with the Government"', 'Lead-text fine. Want a photo of you holding the book?'))
story.append(item('Podcast card', 'Needs: Spotify URL · Apple Podcasts URL · YouTube channel URL · OR RSS feed.', note_lines=3))
story.append(item('TV: أول الساتر / Awal Al-Sater', 'Needs: years aired · YouTube/archive link · notable episode list.', note_lines=3))
story.append(item('YouTube: الكرسي / Al-Korsy', 'Needs: YouTube channel URL · pinned/featured episode link.', note_lines=2))

story.append(Paragraph('Section 8 · Recognitions', h3))
story.append(item('4 awards (UN Vessels, KOT State Award, ASME, ACK Entrepreneurship Center)', 'Want award certificate scans / photos?', note_lines=2))

story.append(Paragraph('Section 9 · Closing CTA', h3))
story.append(item('"Want to work together? → Work with Ali"', 'Locked. Anything to change?'))
story.append(PageBreak())

# ===================== VENTURES =====================
story += page_header('Page 3 of 6', 'Ventures — landing + 4 sub-pages', 'alimubarak1.netlify.app/en/ventures')

story.append(Paragraph('Landing page', h3))
story.append(item('4 venture cards link to sub-pages', 'Locked.'))

story.append(Paragraph('EVA Integrated Company  ·  /ventures/eva', h3))
story.append(item('Full description (beyond the lead paragraph)', 'Currently just lead + "coming soon". Need: services list, premium positioning, target patients.', note_lines=3))
story.append(item('Clinic photos (interior, exterior, reception)', 'You have these in your "Al qiblah clinc" project folder — interior_p2.jpg through interior_p8.jpg and EVA_Reception_Concept.png.', note_lines=2))
story.append(item('Doctor profiles', 'Want to publish doctor names + credentials, or keep doctors private until launch?', note_lines=2))
story.append(item('Booking link / "request appointment" form', 'Standalone EVA contact email/phone? Or routes to ali@alimubarak1.com?', note_lines=2))
story.append(item('Address: Floor 8, Al-Qiblah Medical Centre, Kuwait City', 'Confirm address for public display.', note_lines=1))

story.append(Paragraph('Koshari Bites  ·  /ventures/koshari-bites', h3))
story.append(item('Founding story (2014–today)', 'Currently just "decade-old F&B brand". Tell the actual founding story.', note_lines=4))
story.append(item('Brand photos / food photos', 'Logos and food photos exist in /Documents/Claude/Projects/kosharibites/ — pull them in?', note_lines=2))
story.append(item('Current location(s) + addresses', 'Add map / addresses for current store(s).', note_lines=3))
story.append(item('Franchise prospectus', 'PDF download? Inquiry form? You have AreaDev_Franchise Agreement_KB_V4Final01012016.pdf in the project folder.', note_lines=3))
story.append(item('Franchise inquiry contact', 'Dedicated email like franchise@alimubarak1.com or route to ali@alimubarak1.com?', note_lines=2))

story.append(Paragraph('Ali Abdullah Mubarak Company (AMC)  ·  /ventures/amc', h3))
story.append(item('Capabilities and sectors served', 'Building Construction, Electrical, Power Stations, HVAC. Want detailed capability statements per sector?', note_lines=3))
story.append(item('Past projects / case studies', 'Delta Power oil-field contract is the headline. Other projects to feature?', note_lines=4))
story.append(item('Company logo (ALI wordmark)', 'You have logo files in the construction company folder — pull them in.', note_lines=1))
story.append(item('Tender response process / contact', 'Email for tender invitations? Capability statement PDF?', note_lines=2))

story.append(Paragraph('The National Incubator (TNI)  ·  /ventures/tni', h3))
story.append(item('Program description and structure', 'How does the incubator work? Cohorts, duration, support?', note_lines=4))
story.append(item('Government partners + supporting bodies', 'List of government bodies in negotiation / partnership.', note_lines=3))
story.append(item('Photos / events', 'Any launch event photos, government meeting photos to show?', note_lines=2))
story.append(item('How to apply / partnership inquiry', 'Application form? Open call? Or invitation-only?', note_lines=2))
story.append(PageBreak())

# ===================== INFLUENCE =====================
story += page_header('Page 4 of 6', 'Influence — 6 cards + Shop + Social', 'alimubarak1.netlify.app/en/influence')

story.append(Paragraph('Card 1 · Podcast', h3))
story.append(item('Spotify URL', 'Add: https://open.spotify.com/show/...', note_lines=1))
story.append(item('Apple Podcasts URL', 'Add: https://podcasts.apple.com/...', note_lines=1))
story.append(item('YouTube channel URL (if podcast also on YT)', '', note_lines=1))
story.append(item('Featured / pinned episode', 'Which episode to highlight as "start here"?', note_lines=2))

story.append(Paragraph('Card 2 · TV — أول الساتر / Awal Al-Sater', h3))
story.append(item('YouTube/archive link to episodes', 'Where can people watch?', note_lines=2))
story.append(item('Years aired / current status', 'Past program or ongoing?', note_lines=1))
story.append(item('Notable appearances to feature', 'Specific 2-3 episode highlights?', note_lines=3))

story.append(Paragraph('Card 3 · YouTube — الكرسي / Al-Korsy', h3))
story.append(item('YouTube channel URL', 'youtube.com/@...?', note_lines=1))
story.append(item('Featured episode link', 'Best/most-watched episode to highlight.', note_lines=2))

story.append(Paragraph('Card 4 · Social', h3))
story.append(item('Confirm Instagram @alimubarak1', '', note_lines=1))
story.append(item('Confirm X / Twitter @alimubarak_1', '', note_lines=1))
story.append(item('TikTok handle', '', note_lines=1))
story.append(item('YouTube channel handle / URL', '', note_lines=1))
story.append(item('Snapchat handle', '', note_lines=1))

story.append(Paragraph('Card 5 · Brand Partnerships', h3))
story.append(item('List of brands worked with', 'Aim for 8–20 logos. List them: Brand 1, Brand 2, Brand 3...', note_lines=8))
story.append(item('Logo files for each brand', 'Need PNG/SVG logos. Save to /public/partners/ folder.', note_lines=2))
story.append(item('3–5 featured campaigns to highlight (case studies)', 'Brand · year · what you did · photo/video', note_lines=5))

story.append(Paragraph('Shop · BoutiqaT', h3))
story.append(item('Your real BoutiqaT page URL', 'Currently links to generic boutiqaat.com. What\'s your specific influencer page URL?', note_lines=2))
story.append(item('Featured products to highlight on the website', 'Optional: 3-6 products with images that link to BoutiqaT.', note_lines=4))
story.append(PageBreak())

# ===================== BOOK =====================
story += page_header('Page 5 of 6', 'Book — 11 sections', 'alimubarak1.netlify.app/en/book')

story.append(Paragraph('Hero', h3))
story.append(item('Cover artwork loaded', 'Real cover artwork in place ✓'))
story.append(item('"Pre-order" CTA destination', 'Currently scrolls to pre-order section. Or want it to go to a buy-now flow?', note_lines=2))

story.append(Paragraph('About the Book + Featured 4 chapters + Full TOC + Sample', h3))
story.append(item('Copy locked, sample excerpt locked', 'Anything to refine?', note_lines=3))

story.append(Paragraph('Author section', h3))
story.append(item('Bio + quotes locked', 'Anything to refine?', note_lines=2))

story.append(Paragraph('Endorsements (3 testimonials)', h3))
story.append(item('Final names + titles for each endorser', 'Confirmed real but want to double-check exact spelling/title before public.', note_lines=4))
story.append(item('Optional: photos of endorsers', 'Helps social proof. Need permission.', note_lines=2))

story.append(Paragraph('Speaking', h3))
story.append(item('"Book Ali for your next stage" CTA', 'Where does it link? Calendar? Email? Speaker bureau?', note_lines=2))

story.append(Paragraph('Pre-order — confirm the offer', h3))
story.append(item('eBook 6 KD · Hardcopy 12 KD · Bundle 16 KD', 'Final pricing? Currency = KD only or USD too?', note_lines=2))
story.append(item('Pre-order form backend', 'Currently UI only. Email submissions to you? Mailchimp? CRM?', note_lines=3))
story.append(item('Online payment vs. cash on delivery', 'Form says "no charge today". Stay manual or add payment gateway (KNET/Visa)?', note_lines=2))
story.append(item('Shipping outside Kuwait', 'GCC dropdown is there — but actual shipping rates?', note_lines=2))

story.append(Paragraph('Newsletter — "Notes from the margins"', h3))
story.append(item('Where do subscribers go?', 'Mailchimp list? Substack? Beehiiv? Own database?', note_lines=2))

story.append(Paragraph('Contact form', h3))
story.append(item('Backend / email destination', 'All form submissions email to ali@alimubarak1.com?', note_lines=2))
story.append(PageBreak())

# ===================== WORK WITH ALI =====================
story += page_header('Page 6 of 6', 'Work With Ali', 'alimubarak1.netlify.app/en/work-with-ali')

story.append(item('3 service cards locked: Advisory · Speaking · Board roles', 'Anything to refine?', note_lines=2))
story.append(item('Pricing / rates — publish or hide?', 'Some advisors publish indicative day rates ($X/day for keynote, $X/month retainer). Others keep it inquiry-only.', note_lines=2))
story.append(item('Calendar booking', 'Cal.com / Calendly integration so people can book intro calls directly?', note_lines=2))
story.append(item('Inquiry form backend', 'Email submissions where?', note_lines=2))
story.append(item('Geographic availability', 'Kuwait/GCC only or global? Travel willingness?', note_lines=2))
story.append(item('Phone number for serious advisory inquiries?', 'Publish a private number, or keep all contact through form/email?', note_lines=2))
story.append(PageBreak())

# ===================== CROSS-CUTTING =====================
story += page_header('Cross-cutting', 'Site-wide items', 'Apply across every page')

story.append(Paragraph('Domain & Email', h3))
story.append(item('Connect alimubarak1.com to Netlify', 'Currently live at alimubarak1.netlify.app. Update DNS at GoDaddy. ~5 minutes.'))
story.append(item('Set up ali@alimubarak1.com via iCloud+ custom domain', 'Once iCloud+ subscription confirmed. ~10 minutes.'))

story.append(Paragraph('Forms & Backend', h3))
story.append(item('Make all forms functional', 'Newsletter, sample request, pre-order, book contact, work-with-ali. Recommend Netlify Forms (free, 100 subs/month).', note_lines=2))

story.append(Paragraph('Bilingual Polish', h3))
story.append(item('Arabic Kuwaiti voice review', 'Pass through every Arabic page using arabic-kuwaiti-writer skill. Tighten phrasing where it sounds translated.', note_lines=2))

story.append(Paragraph('Legal / Compliance', h3))
story.append(item('Privacy Policy page', 'Required if collecting form submissions.', note_lines=1))
story.append(item('Terms of Service', 'Optional but professional.', note_lines=1))
story.append(item('Cookie consent banner', 'Only needed if Google Analytics / tracking added.', note_lines=1))

story.append(Paragraph('SEO & Discoverability', h3))
story.append(item('Open Graph social-share images', 'When someone shares /book on WhatsApp/X, what image appears?', note_lines=1))
story.append(item('Favicon + site logo', 'Currently using default Next.js favicon. Want a custom one — initials AM in gold?', note_lines=1))
story.append(item('SEO meta descriptions per page', 'Each page should have a unique 150-char description for Google.', note_lines=1))
story.append(item('sitemap.xml + robots.txt', 'For Google indexing.', note_lines=1))
story.append(item('Google Analytics or Plausible', 'Track visits, where traffic comes from. Optional.', note_lines=1))

story.append(Paragraph('Security & Hygiene', h3))
story.append(item('Delete the GitHub PAT', '[TOKEN-REDACTED] — created today for one-time push. Delete from GitHub settings → Tokens.'))
story.append(item('Set up local Git auth on Mac', 'So future pushes don\'t need a PAT.', note_lines=1))
story.append(PageBreak())

# ===================== NOTES PAGES =====================
story += page_header('Free Notes', 'Whatever else comes to mind', 'Use these pages for ideas, sketches, photo names, anything')

story.append(notes_block(lines=24))
story.append(PageBreak())

story.append(notes_block(lines=24))

# Build
doc.build(story)
print(f'Built: {OUT}')
