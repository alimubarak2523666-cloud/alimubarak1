from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random

W, H = 1080, 1920
F = 'fonts/'
EMERALD, DEEP, CREAM, GOLD, SAND = (14, 74, 62), (10, 51, 41), (250, 246, 238), (161, 123, 58), (232, 220, 196)

# footage box: source 1080x732 scaled to 1000 wide
VX, VW = 40, 1000
VH = round(732 * VW / 1080 / 2) * 2  # 678
VY = 600

img = Image.new('RGBA', (W, H), DEEP + (255,))
# vertical gradient emerald -> deep
g = ImageDraw.Draw(img)
for y in range(H):
    t = abs(y - 900) / 1100
    c = tuple(round(EMERALD[i] * (1 - t) + DEEP[i] * t) for i in range(3))
    g.line([(0, y), (W, y)], fill=c + (255,))
# fine grain for a printed feel
random.seed(7)
noise = Image.new('L', (W, H))
noise.putdata([random.randint(0, 255) for _ in range(W * H)])
grain = Image.new('RGBA', (W, H), (255, 255, 255, 0))
grain.putalpha(noise.point(lambda v: 6 if v > 200 else 0))
img = Image.alpha_composite(img, grain)

d = ImageDraw.Draw(img)
def font(name, size): return ImageFont.truetype(F + name, size)

def center(text, y, f, fill, spacing=0, **kw):
    if spacing:
        # manual tracking for Latin caps
        widths = [d.textlength(ch, font=f) for ch in text]
        total = sum(widths) + spacing * (len(text) - 1)
        x = (W - total) / 2
        for ch, w in zip(text, widths):
            d.text((x, y), ch, font=f, fill=fill, anchor='ls')
            x += w + spacing
        return
    d.text((W / 2, y), text, font=f, fill=fill, anchor='ms', **kw)

# --- header (kept below the Reels top UI zone) ---
center('ذاكرة الكرة الكويتية', 330, font('Plex-500.ttf', 34), GOLD, direction='rtl', language='ar')
d.line([(W / 2 - 60, 362), (W / 2 + 60, 362)], fill=GOLD, width=2)
hf = font('Naskh-700.ttf', 58)
center('بدران يُهدي هدفه ضد نجوم العالم', 450, hf, CREAM, direction='rtl', language='ar')
center('لأمير الإنسانية الشيخ صباح الأحمد', 540, hf, SAND, direction='rtl', language='ar')

# --- footage frame: soft shadow + gold hairline, transparent window ---
shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ImageDraw.Draw(shadow).rectangle([VX - 4, VY + 10, VX + VW + 4, VY + VH + 22], fill=(0, 0, 0, 130))
shadow = shadow.filter(ImageFilter.GaussianBlur(18))
img = Image.alpha_composite(img, shadow)
d = ImageDraw.Draw(img)
d.rectangle([VX - 9, VY - 9, VX + VW + 8, VY + VH + 8], outline=GOLD, width=2)
d.rectangle([VX, VY, VX + VW - 1, VY + VH - 1], fill=(0, 0, 0, 0))

# --- signature block ---
sy = VY + VH + 110
center('ALI MUBARAK', sy, font('Playfair-700.ttf', 52), CREAM, spacing=10)
d.line([(W / 2 - 150, sy + 34), (W / 2 - 20, sy + 34)], fill=GOLD, width=2)
d.line([(W / 2 + 20, sy + 34), (W / 2 + 150, sy + 34)], fill=GOLD, width=2)
d.regular_polygon((W / 2, sy + 34, 6), 4, fill=GOLD)
center('علي مبارك', sy + 100, font('Naskh-700.ttf', 40), SAND, direction='rtl', language='ar')
center('@alimubarak1', sy + 160, font('Inter-500.ttf', 30), GOLD, spacing=2)

img.save('frame.png')
print('video box', VX, VY, VW, VH, 'sig bottom', sy + 160)
