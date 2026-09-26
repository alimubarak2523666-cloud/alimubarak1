"""Badran reel — dark-blue motion-graphics edit with hand-drawn sketch annotations.

Renders every frame with cairo (anti-aliased strokes) + PIL (Arabic text shaping),
reads the cropped footage from ffmpeg and pipes finished frames back into ffmpeg.
Usage: python3 motion.py SRC OUT [--preview t1,t2,...]
"""
import math, subprocess, sys, functools
import numpy as np
import cairo
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FFMPEG = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
FONTS = 'fonts/'
W, H = 1080, 1920
FPS = 30000 / 1001
SRC_DUR = 94.67
END = 96.6                       # 2 s branded end card after the footage
FX, FY, FW, FH = 40, 600, 1000, 678
FCX, FCY = FX + FW / 2, FY + FH / 2

# palette — dark blue base, electric-blue sketch accents
BG_TOP, BG_MID, BG_BOT = (0x0b, 0x1d, 0x46), (0x07, 0x14, 0x34), (0x03, 0x09, 0x1c)
CYAN = (0.33, 0.78, 1.0)
ICE = (0.72, 0.87, 1.0)
WHITE = (1, 1, 1)
YELLOW = (1.0, 0.84, 0.29)
RED = (1.0, 0.33, 0.40)
NAVY_CHIP = (0.05, 0.12, 0.30)

GOALS = [9.0, 54.6]

# ------------------------------------------------------------------ easing
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def prog(t, a, b): return clamp((t - a) / (b - a)) if b > a else float(t >= a)
def ease_out(x): return 1 - (1 - x) ** 3
def ease_in_out(x): return 3 * x * x - 2 * x * x * x
def ease_back(x, s=1.7):
    x -= 1
    return 1 + (s + 1) * x ** 3 + s * x ** 2

def window(t, a, b, fin=0.35, fout=0.3):
    """(visible, in-progress 0..1, out-progress 0..1)"""
    if t < a or t > b: return False, 0, 1
    return True, prog(t, a, a + fin), prog(t, b - fout, b)

# ------------------------------------------------------------------ text sprites
@functools.lru_cache(maxsize=None)
def font(name, size): return ImageFont.truetype(FONTS + name, size)

def is_ar(s): return any('؀' <= c <= 'ۿ' for c in s)

@functools.lru_cache(maxsize=None)
def text_sprite(text, fname, size, color=(255, 255, 255), stroke=0, stroke_color=(0, 0, 0),
                tracking=0, maxw=None):
    f = font(fname, size)
    kw = dict(direction='rtl', language='ar') if is_ar(text) else {}
    tmp = ImageDraw.Draw(Image.new('L', (1, 1)))
    if tracking:
        widths = [tmp.textlength(c, font=f) for c in text]
        tw = sum(widths) + tracking * (len(text) - 1)
    else:
        tw = tmp.textlength(text, font=f, **kw)
    if maxw and tw > maxw:
        return text_sprite(text, fname, int(size * maxw / tw), color, stroke, stroke_color, tracking, None)
    asc, desc = f.getmetrics()
    pad = stroke + 12
    im = Image.new('RGBA', (int(tw) + 2 * pad, asc + desc + 2 * pad), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if tracking:
        x = pad
        for c, w in zip(text, widths):
            d.text((x, pad), c, font=f, fill=color + (255,), stroke_width=stroke, stroke_fill=stroke_color + (255,))
            x += w + tracking
    else:
        d.text((pad, pad), text, font=f, fill=color + (255,), stroke_width=stroke,
               stroke_fill=stroke_color + (255,), **kw)
    bbox = im.getbbox()
    im = im.crop((max(0, bbox[0] - 4), max(0, bbox[1] - 4), min(im.width, bbox[2] + 4), min(im.height, bbox[3] + 4)))
    return pil_to_surface(im)

def pil_to_surface(im):
    a = np.asarray(im.convert('RGBA')).astype(np.float32)
    alpha = a[..., 3:4] / 255.0
    bgra = np.empty_like(a)
    bgra[..., 0] = a[..., 2] * alpha[..., 0]
    bgra[..., 1] = a[..., 1] * alpha[..., 0]
    bgra[..., 2] = a[..., 0] * alpha[..., 0]
    bgra[..., 3] = a[..., 3]
    h, w = a.shape[:2]
    stride = cairo.ImageSurface.format_stride_for_width(cairo.FORMAT_ARGB32, w)
    buf = np.zeros((h, stride // 4, 4), np.uint8)
    buf[:, :w] = bgra.round().astype(np.uint8)
    return cairo.ImageSurface.create_for_data(bytearray(buf.tobytes()), cairo.FORMAT_ARGB32, w, h, stride)

def draw_sprite(ctx, s, cx, cy, scale=1.0, rot=0.0, alpha=1.0, wipe=None, wipe_dir='rtl'):
    if alpha <= 0.001 or scale <= 0.001: return
    w, h = s.get_width(), s.get_height()
    ctx.save()
    ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(scale, scale); ctx.translate(-w / 2, -h / 2)
    if wipe is not None:
        rw = w * wipe
        ctx.rectangle(w - rw if wipe_dir == 'rtl' else 0, 0, rw, h); ctx.clip()
    ctx.set_source_surface(s, 0, 0)
    ctx.paint_with_alpha(alpha)
    ctx.restore()

# ------------------------------------------------------------------ sketch strokes
def boil_seed(base, frame, every=4): return (base * 7919 + frame // every) & 0xffffffff

def jitter(pts, seed, amp):
    pts = np.asarray(pts, float)
    if amp <= 0: return pts
    rng = np.random.default_rng(seed)
    n = len(pts)
    k = max(3, n // 8)                     # low-frequency wobble, not noise
    ctrl = rng.normal(0, amp, (k, 2))
    xs = np.linspace(0, k - 1, n)
    wob = np.stack([np.interp(xs, np.arange(k), ctrl[:, i]) for i in range(2)], 1)
    return pts + wob + rng.normal(0, amp * 0.18, (n, 2))

def stroke(ctx, pts, p=1.0, width=4, rgb=WHITE, alpha=1.0, seed=0, frame=0, amp=1.6, double=True):
    if p <= 0 or alpha <= 0: return
    pts = np.asarray(pts, float)
    seg = np.hypot(*np.diff(pts, axis=0).T)
    cum = np.concatenate([[0], np.cumsum(seg)])
    L = cum[-1] * clamp(p)
    passes = [(0, 1.0, width)] + ([(1, 0.45, width * 0.55)] if double else [])
    for k, a, wd in passes:
        q = jitter(pts, boil_seed(seed * 3 + k, frame), amp * (1.3 if k else 1))
        ctx.save()
        ctx.set_line_cap(cairo.LINE_CAP_ROUND); ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        ctx.set_line_width(wd); ctx.set_source_rgba(*rgb, alpha * a)
        ctx.move_to(*q[0])
        for i in range(1, len(q)):
            if cum[i] <= L:
                ctx.line_to(*q[i])
            else:
                f = (L - cum[i - 1]) / max(seg[i - 1], 1e-6)
                ctx.line_to(*(q[i - 1] + (q[i] - q[i - 1]) * f)); break
        ctx.stroke(); ctx.restore()

def circle_pts(cx, cy, r, turns=1.12, n=90, start=-2.2, seed=1, ry=None):
    rng = np.random.default_rng(seed)
    ph = rng.uniform(0, 6.28, 3)
    a = start + np.linspace(0, turns * 2 * math.pi, n)
    rr = r * (1 + 0.06 * np.sin(2 * a + ph[0]) + 0.03 * np.sin(3 * a + ph[1])) * np.linspace(1.0, 1.08, n)
    return np.stack([cx + rr * np.cos(a), cy + (ry or r) / r * rr * np.sin(a)], 1)

def heart_pts(cx, cy, s, n=70):
    t = np.linspace(0, 2 * math.pi, n)
    x = 16 * np.sin(t) ** 3
    y = -(13 * np.cos(t) - 5 * np.cos(2 * t) - 2 * np.cos(3 * t) - np.cos(4 * t))
    return np.stack([cx + x * s / 16, cy + y * s / 16], 1)

def curve_pts(a, b, bend=0.25, n=40):
    a, b = np.array(a, float), np.array(b, float)
    m = (a + b) / 2; d = b - a
    c = m + np.array([-d[1], d[0]]) * bend
    t = np.linspace(0, 1, n)[:, None]
    return (1 - t) ** 2 * a + 2 * (1 - t) * t * c + t ** 2 * b

def arrow(ctx, a, b, p, rgb, width=5, bend=0.25, seed=0, frame=0, alpha=1.0):
    pts = curve_pts(a, b, bend)
    stroke(ctx, pts, prog(p, 0, 0.75), width, rgb, alpha, seed, frame)
    hp = prog(p, 0.7, 1.0)
    if hp > 0:
        tip = pts[-1]; d = pts[-1] - pts[-5]; ang = math.atan2(d[1], d[0])
        for s in (-1, 1):
            e = tip - 30 * np.array([math.cos(ang + s * 0.5), math.sin(ang + s * 0.5)])
            stroke(ctx, [tip, e], hp, width, rgb, alpha, seed + 10 + s, frame, amp=0.8, double=False)

def rrect_pts(x, y, w, h, r, n_side=14):
    pts = []
    corners = [(x + w - r, y + r, -math.pi / 2), (x + w - r, y + h - r, 0), (x + r, y + h - r, math.pi / 2), (x + r, y + r, math.pi)]
    for cx, cy, a0 in corners:
        for a in np.linspace(a0, a0 + math.pi / 2, 8):
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    pts.append(pts[0]); pts.append(pts[1])
    out = []
    for i in range(len(pts) - 1):
        for f in np.linspace(0, 1, 4, endpoint=False):
            out.append((pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f))
    return np.array(out)

def rrect_path(ctx, x, y, w, h, r):
    ctx.new_sub_path()
    ctx.arc(x + w - r, y + r, r, -math.pi / 2, 0); ctx.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
    ctx.arc(x + r, y + h - r, r, math.pi / 2, math.pi); ctx.arc(x + r, y + r, r, math.pi, 1.5 * math.pi)
    ctx.close_path()

def sparkle(ctx, cx, cy, s, rgb, alpha, seed, frame):
    for i, (dx, dy) in enumerate([(0, 1), (1, 0)]):
        stroke(ctx, [(cx - dx * s, cy - dy * s), (cx + dx * s, cy + dy * s)], 1, 3.5, rgb, alpha, seed + i, frame, 0.6, False)
    for i, (dx, dy) in enumerate([(1, 1), (1, -1)]):
        k = s * 0.45
        stroke(ctx, [(cx - dx * k, cy - dy * k), (cx + dx * k, cy + dy * k)], 1, 2.5, rgb, alpha * 0.7, seed + 5 + i, frame, 0.4, False)

def ball_doodle(ctx, cx, cy, r, rot, p, rgb, alpha, seed, frame):
    stroke(ctx, circle_pts(cx, cy, r, 1.05, 60, rot, seed), p, 3.5, rgb, alpha, seed, frame, 0.8)
    q = prog(p, 0.5, 1)
    if q > 0:
        pent = [(cx + r * 0.42 * math.cos(rot + i * 2 * math.pi / 5), cy + r * 0.42 * math.sin(rot + i * 2 * math.pi / 5)) for i in range(6)]
        stroke(ctx, pent, q, 3, rgb, alpha, seed + 2, frame, 0.5, False)
        for i in range(5):
            a = rot + i * 2 * math.pi / 5
            stroke(ctx, [(cx + r * 0.42 * math.cos(a), cy + r * 0.42 * math.sin(a)), (cx + r * 0.95 * math.cos(a), cy + r * 0.95 * math.sin(a))], q, 2.5, rgb, alpha, seed + 3 + i, frame, 0.4, False)

def burst_rays(ctx, cx, cy, r1, r2, n, p, rgb, alpha, seed, frame):
    rng = np.random.default_rng(seed)
    for i in range(n):
        a = i * 2 * math.pi / n + rng.uniform(-0.12, 0.12)
        l2 = r2 * rng.uniform(0.8, 1.15)
        stroke(ctx, [(cx + r1 * math.cos(a), cy + r1 * math.sin(a)), (cx + l2 * math.cos(a), cy + l2 * math.sin(a))],
               p, 5, rgb, alpha, seed + i, frame, 0.8, False)

# ------------------------------------------------------------------ static layers
def make_glow():
    pad = 90
    im = Image.new('RGBA', (FW + 2 * pad, FH + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([pad, pad, pad + FW, pad + FH], 30, fill=(70, 170, 255, 200))
    return pil_to_surface(im.filter(ImageFilter.GaussianBlur(38))), pad

GLOW, GPAD = None, 0
rng0 = np.random.default_rng(42)
PARTICLES = [(rng0.uniform(0, W), rng0.uniform(0, H), rng0.uniform(8, 30), rng0.uniform(1.2, 3.2), rng0.uniform(0, 6.28)) for _ in range(60)]
# faint tactics-board doodles scattered in the background (X / O / dashed runs)
TACTICS = [('o', 150, 220), ('x', 930, 250), ('o', 880, 1560), ('x', 170, 1600), ('o', 520, 1700), ('x', 760, 1780),
           ('run', (130, 1700), (330, 1560)), ('run', (950, 1690), (720, 1600)), ('run', (80, 150), (260, 90))]

# ------------------------------------------------------------------ scene content
HEAD1 = 'بدران يُهدي هدفه ضد نجوم العالم'
HEAD2 = 'لأمير الإنسانية الشيخ صباح الأحمد'
CHIPS = [  # (start, end, text, icon)
    (0.9, 8.8, 'الكويت × نجوم العالم', 'ball'),
    (13.4, 19.6, 'والإهداء… لأمير الإنسانية', 'heart'),
    (19.9, 33.6, 'لحظة ما تنتسى', 'star'),
    (34.1, 83.5, 'الهدف من كل الزوايا', 'rewind'),
    (83.9, 87.8, 'فرحة الجماهير', 'star'),
    (88.0, 92.8, 'رحمك الله يا أمير الإنسانية', 'heart'),
]
REPLAY = (34.0, 83.6)
BURSTS = [(9.0, 12.6, 'هدف', 'GOOOAL!'), (54.6, 57.8, 'يا سلام', 'WHAT A FINISH!')]
HEARTS = [(14.0, 19.5), (88.2, 92.8)]
ENDCARD = 92.9

def draw_background(ctx, t, frame):
    g = cairo.LinearGradient(0, 0, 0, H)
    g.add_color_stop_rgb(0, *[c / 255 for c in BG_TOP]); g.add_color_stop_rgb(0.5, *[c / 255 for c in BG_MID])
    g.add_color_stop_rgb(1, *[c / 255 for c in BG_BOT])
    ctx.set_source(g); ctx.paint()
    # breathing blue glow behind the footage
    gx = FCX + 60 * math.sin(t * 0.35); gy = FCY - 40 + 50 * math.cos(t * 0.27)
    rg = cairo.RadialGradient(gx, gy, 50, gx, gy, 900)
    rg.add_color_stop_rgba(0, 0.12, 0.35, 0.85, 0.42 + 0.08 * math.sin(t * 1.3)); rg.add_color_stop_rgba(1, 0.05, 0.12, 0.3, 0)
    ctx.set_source(rg); ctx.paint()
    # blueprint grid drifting upward
    ctx.set_line_width(1); ctx.set_source_rgba(0.55, 0.75, 1, 0.055)
    off = (t * 18) % 60
    for x in range(0, W + 1, 60):
        ctx.move_to(x + 0.5, 0); ctx.line_to(x + 0.5, H)
    y = -off
    while y < H:
        ctx.move_to(0, y + 0.5); ctx.line_to(W, y + 0.5); y += 60
    ctx.stroke()
    # diagonal light sweep every 6 s
    ph = (t % 6.0) / 6.0
    sx = -600 + ph * (W + 1400)
    lg = cairo.LinearGradient(sx - 220, 0, sx + 220, 400)
    lg.add_color_stop_rgba(0, 1, 1, 1, 0); lg.add_color_stop_rgba(0.5, 0.6, 0.8, 1, 0.07); lg.add_color_stop_rgba(1, 1, 1, 1, 0)
    ctx.set_source(lg); ctx.paint()
    # tactics doodles, boiling
    for i, item in enumerate(TACTICS):
        dy = 8 * math.sin(t * 0.6 + i)
        if item[0] == 'o':
            stroke(ctx, circle_pts(item[1], item[2] + dy, 26, 1.05, 40, 0, 100 + i), 1, 3, ICE, 0.13, 100 + i, frame, 1.0, False)
        elif item[0] == 'x':
            x, y = item[1], item[2] + dy
            stroke(ctx, [(x - 22, y - 22), (x + 22, y + 22)], 1, 3, ICE, 0.13, 120 + i, frame, 0.8, False)
            stroke(ctx, [(x + 22, y - 22), (x - 22, y + 22)], 1, 3, ICE, 0.13, 140 + i, frame, 0.8, False)
        else:
            ctx.save(); ctx.set_dash([10, 12], -t * 30)
            a, b = np.array(item[1]) + (0, dy), np.array(item[2]) + (0, dy)
            pts = curve_pts(a, b, 0.3)
            ctx.set_line_width(3); ctx.set_source_rgba(*ICE, 0.12); ctx.set_line_cap(cairo.LINE_CAP_ROUND)
            ctx.move_to(*pts[0]); [ctx.line_to(*q) for q in pts[1:]]; ctx.stroke(); ctx.restore()
    # floating particles
    for (px, py, sp, r, ph0) in PARTICLES:
        y = (py - t * sp) % (H + 40) - 20
        a = 0.18 + 0.22 * (0.5 + 0.5 * math.sin(t * 2 + ph0))
        ctx.set_source_rgba(0.6, 0.85, 1, a); ctx.arc(px + 10 * math.sin(t * 0.5 + ph0), y, r, 0, 2 * math.pi); ctx.fill()

def draw_header(ctx, t, frame, fade):
    if fade <= 0: return
    # eyebrow pill
    eb = text_sprite('ذاكرة الكرة الكويتية', 'Plex-500.ttf', 32, (140, 210, 255))
    ew, eh = eb.get_width(), eb.get_height()
    p = prog(t, 0.05, 0.6)
    draw_sprite(ctx, eb, W / 2, 300, alpha=fade * ease_out(prog(t, 0.15, 0.5)))
    stroke(ctx, rrect_pts(W / 2 - ew / 2 - 34, 300 - eh / 2 - 14, ew + 68, eh + 28, (eh + 28) / 2), p, 3, CYAN, fade * 0.9, 7, frame)
    ball_doodle(ctx, W / 2 + ew / 2 + 70, 300, 20, t * 1.6, prog(t, 0.3, 0.9), CYAN, fade, 9, frame)
    # headline — right-to-left wipe with a small rise
    h1 = text_sprite(HEAD1, 'Plex-700.ttf', 62, (255, 255, 255), maxw=960)
    h2 = text_sprite(HEAD2, 'Plex-700.ttf', 58, (170, 220, 255), maxw=960)
    p1, p2 = ease_out(prog(t, 0.25, 0.95)), ease_out(prog(t, 0.55, 1.25))
    draw_sprite(ctx, h1, W / 2, 405 + 20 * (1 - p1), alpha=fade * p1, wipe=p1)
    draw_sprite(ctx, h2, W / 2, 490 + 20 * (1 - p2), alpha=fade * p2, wipe=p2)
    # scribble underline under line 2 (drawn right-to-left, like handwriting)
    uw = h2.get_width() * 0.9
    xs = np.linspace(W / 2 + uw / 2, W / 2 - uw / 2, 40)
    ys = 535 + 4 * np.sin(np.linspace(0, 5, 40))
    stroke(ctx, np.stack([xs, ys], 1), prog(t, 1.2, 1.8), 5, CYAN, fade * 0.95, 11, frame, 1.2)
    # twinkles
    for i, (x, y) in enumerate([(150, 250), (990, 470), (92, 545)]):
        s = 12 + 5 * math.sin(t * 3 + i * 2)
        sparkle(ctx, x, y, s, WHITE if i != 1 else CYAN, fade * ease_out(prog(t, 1.0 + i * 0.2, 1.5 + i * 0.2)), 20 + i * 10, frame)

def draw_footage(ctx, surf, t, frame, alpha, scale):
    if alpha <= 0: return
    dx = dy = 0.0
    for g in GOALS:  # decaying shake on the goal hit
        k = prog(t, g, g + 0.55)
        if 0 < k < 1:
            amp = 12 * (1 - k)
            dx += amp * math.sin(frame * 2.7); dy += amp * math.cos(frame * 3.3)
    ctx.save()
    ctx.translate(FCX + dx, FCY + dy); ctx.scale(scale, scale); ctx.translate(-FCX, -FCY)
    # glow
    ctx.set_source_surface(GLOW, FX - GPAD, FY - GPAD); ctx.paint_with_alpha(alpha * (0.45 + 0.15 * math.sin(t * 2.2)))
    rrect_path(ctx, FX, FY, FW, FH, 26); ctx.save(); ctx.clip()
    if surf is not None:
        ctx.set_source_surface(surf, FX, FY); ctx.paint_with_alpha(alpha)
    for g in GOALS:  # white flash
        k = prog(t, g, g + 0.3)
        if 0 < k < 1:
            ctx.set_source_rgba(1, 1, 1, 0.55 * (1 - k) * alpha); ctx.paint()
    ctx.restore()
    rrect_path(ctx, FX, FY, FW, FH, 26); ctx.set_line_width(2.5); ctx.set_source_rgba(0.7, 0.87, 1, 0.45 * alpha); ctx.stroke()
    ctx.restore()
    # hand-drawn corner brackets
    p = prog(t, 0.35, 0.95)
    o, L = 16, 80
    for i, (cx, cy, sx, sy) in enumerate([(FX - o, FY - o, 1, 1), (FX + FW + o, FY - o, -1, 1),
                                          (FX - o, FY + FH + o, 1, -1), (FX + FW + o, FY + FH + o, -1, -1)]):
        stroke(ctx, [(cx, cy + sy * L), (cx, cy), (cx + sx * L, cy)], p, 5, CYAN, alpha, 30 + i, frame, 1.2)

def draw_replay(ctx, t, frame):
    vis, pi, po = window(t, *REPLAY, 0.4, 0.3)
    if not vis: return
    a = ease_out(pi) * (1 - po)
    txt = text_sprite('REPLAY', 'Montserrat.ttf', 26, (6, 20, 52), tracking=4)
    w, h = txt.get_width() + 92, 50
    x, y = FX + FW - 24 - w, FY + 24
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(0.8 + 0.2 * ease_back(pi), 0.8 + 0.2 * ease_back(pi)); ctx.translate(-(x + w / 2), -(y + h / 2))
    rrect_path(ctx, x, y, w, h, h / 2); ctx.set_source_rgba(*CYAN, 0.95 * a); ctx.fill()
    # rewind glyph + blinking dot
    bx = x + 30
    for k in (0, 14):
        ctx.move_to(bx + k + 12, y + 14); ctx.line_to(bx + k, y + 25); ctx.line_to(bx + k + 12, y + 36); ctx.close_path()
    ctx.set_source_rgba(0.02, 0.08, 0.2, a); ctx.fill()
    draw_sprite(ctx, txt, x + 58 + txt.get_width() / 2, y + h / 2, alpha=a)
    ctx.restore()
    blink = 0.5 + 0.5 * math.sin(t * 6)
    ctx.set_source_rgba(*RED, a * blink); ctx.arc(x - 16, y + h / 2, 7, 0, 2 * math.pi); ctx.fill()

def draw_icon(ctx, kind, cx, cy, p, alpha, t, frame, seed):
    if kind == 'ball':
        ball_doodle(ctx, cx, cy, 20, t * 2, p, CYAN, alpha, seed, frame)
    elif kind == 'heart':
        s = 20 * (1 + 0.08 * math.sin(t * 7))
        pts = heart_pts(cx, cy, s)
        if p >= 1:
            ctx.move_to(*pts[0]); [ctx.line_to(*q) for q in pts[1:]]; ctx.close_path(); ctx.set_source_rgba(*RED, alpha * 0.35); ctx.fill()
        stroke(ctx, pts, p, 4, RED, alpha, seed, frame, 0.9)
    elif kind == 'star':
        sparkle(ctx, cx, cy, 20 * ease_back(clamp(p)) + 3 * math.sin(t * 4), YELLOW, alpha, seed, frame)
    elif kind == 'rewind':
        stroke(ctx, circle_pts(cx, cy, 18, 0.8, 40, -0.5, seed), p, 4, CYAN, alpha, seed, frame, 0.6, False)
        ang = -0.5
        tip = (cx + 18 * math.cos(ang), cy + 18 * math.sin(ang))
        stroke(ctx, [(tip[0] - 2, tip[1] - 12), tip, (tip[0] + 11, tip[1] - 4)], prog(p, 0.6, 1), 4, CYAN, alpha, seed + 1, frame, 0.5, False)

def draw_chips(ctx, t, frame, fade):
    for i, (a, b, txt, icon) in enumerate(CHIPS):
        vis, pi, po = window(t, a, b, 0.4, 0.3)
        if not vis: continue
        s = text_sprite(txt, 'Plex-700.ttf', 42, (255, 255, 255))
        tw, th = s.get_width(), s.get_height()
        w, h = tw + 150, 82
        cx, cy = W / 2, 1368 + 14 * po
        al = ease_out(pi) * (1 - po) * fade
        sc = 0.85 + 0.15 * ease_back(pi)
        ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.translate(-cx, -cy)
        rrect_path(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.set_source_rgba(*NAVY_CHIP, 0.92 * al); ctx.fill()
        stroke(ctx, rrect_pts(cx - w / 2, cy - h / 2, w, h, h / 2), prog(t, a + 0.1, a + 0.7), 3.5, CYAN, al, 200 + i, frame, 1.3)
        draw_sprite(ctx, s, cx - 30, cy, alpha=al, wipe=ease_out(prog(t, a + 0.1, a + 0.55)))
        draw_icon(ctx, icon, cx + w / 2 - 50, cy, prog(t, a + 0.2, a + 0.8), al, t, frame, 220 + i)
        ctx.restore()

def draw_bursts(ctx, t, frame):
    for i, (a, b, ar, en) in enumerate(BURSTS):
        vis, pi, po = window(t, a, b, 0.35, 0.3)
        if not vis: continue
        cx, cy = 320, 1115
        sc = ease_back(pi, 2.4) * (1 - 0.3 * po)
        al = 1 - po
        burst_rays(ctx, cx, cy, 150, 215, 14, prog(t, a + 0.05, a + 0.4), CYAN, al, 300 + i * 40, frame)
        big = text_sprite(ar, 'Lalezar.ttf', 150, (255, 255, 255), stroke=9, stroke_color=(6, 18, 50))
        draw_sprite(ctx, big, cx, cy - 10, sc * (1 + 0.03 * math.sin(t * 9)), -0.12, al)
        sm = text_sprite(en, 'PermanentMarker.ttf', 40, (255, 214, 74), stroke=4, stroke_color=(6, 18, 50))
        draw_sprite(ctx, sm, cx + 20, cy + 95, ease_back(prog(t, a + 0.2, a + 0.55)), -0.05, al)

def draw_goal_annotation(ctx, t, frame):
    vis, pi, po = window(t, 10.2, 13.25, 0.3, 0.2)
    if not vis: return
    al = 1 - po
    bx, by = FX + 962, FY + 476
    stroke(ctx, circle_pts(bx, by, 50, 1.15, 90, -2.4, 400, ry=46), prog(t, 10.25, 10.8), 6, YELLOW, al, 400, frame, 1.4)
    arrow(ctx, (760, 1190), (905, 1105), prog(t, 10.6, 11.2), YELLOW, 6, -0.3, 410, frame, al)
    lab = text_sprite('في الشبكة!', 'ArefRuqaa.ttf', 50, (255, 214, 74), stroke=3, stroke_color=(6, 18, 50))
    draw_sprite(ctx, lab, 690, 1225, ease_back(prog(t, 11.0, 11.35)), -0.06, al)

def draw_hearts(ctx, t, frame):
    for k, (a, b) in enumerate(HEARTS):
        if not (a <= t <= b): continue
        fo = 1 - prog(t, b - 0.4, b)
        rng = np.random.default_rng(500 + k)
        for j in range(7):
            st = a + j * 0.55 + rng.uniform(0, 0.3)
            life = prog(t, st, st + 2.6)
            if life <= 0 or life >= 1: continue
            x = FX + FW * rng.uniform(0.55, 0.93) + 18 * math.sin(t * 2 + j)
            y = FY + FH - 30 - life * 330
            s = rng.uniform(18, 30) * (0.6 + 0.4 * ease_back(prog(life, 0, 0.2)))
            al = fo * (1 - prog(life, 0.7, 1))
            pts = heart_pts(x, y, s)
            ctx.move_to(*pts[0]); [ctx.line_to(*q) for q in pts[1:]]; ctx.close_path(); ctx.set_source_rgba(*RED, 0.5 * al); ctx.fill()
            stroke(ctx, pts, 1, 3.5, (1, 0.85, 0.87), al, 520 + j, frame, 0.7, False)

def draw_progress(ctx, t, frame, fade):
    if fade <= 0: return
    y = 1302; x0, x1 = FX + 20, FX + FW - 20
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_line_width(4); ctx.set_source_rgba(1, 1, 1, 0.13 * fade); ctx.move_to(x0, y); ctx.line_to(x1, y); ctx.stroke()
    px = x0 + (x1 - x0) * clamp(t / SRC_DUR)
    ctx.set_source_rgba(*CYAN, 0.95 * fade); ctx.move_to(x0, y); ctx.line_to(px, y); ctx.stroke()
    ball_doodle(ctx, px, y, 11, t * 6, 1, WHITE, fade, 600, frame)

def draw_signature(ctx, t, frame, fade):
    if fade <= 0: return
    a = fade * ease_out(prog(t, 1.2, 1.8))
    n = text_sprite('ALI MUBARAK', 'Montserrat.ttf', 30, (255, 255, 255), tracking=7)
    hnd = text_sprite('@alimubarak1', 'Inter-500.ttf', 28, (120, 200, 255))
    gap = 44
    tot = n.get_width() + gap + hnd.get_width()
    x = W / 2 - tot / 2
    y = 1462
    draw_sprite(ctx, n, x + n.get_width() / 2, y, alpha=a)
    ctx.set_source_rgba(*CYAN, a); ctx.arc(x + n.get_width() + gap / 2, y, 4, 0, 2 * math.pi); ctx.fill()
    draw_sprite(ctx, hnd, x + n.get_width() + gap + hnd.get_width() / 2, y, alpha=a)

def draw_endcard(ctx, t, frame):
    if t < ENDCARD: return
    a0 = ENDCARD
    cy = 900
    name = text_sprite('ALI MUBARAK', 'Montserrat.ttf', 96, (255, 255, 255), tracking=10, maxw=940)
    p = ease_out(prog(t, a0 + 0.3, a0 + 0.9))
    draw_sprite(ctx, name, W / 2, cy + 25 * (1 - p), alpha=p, wipe=p, wipe_dir='ltr')
    nw = name.get_width()
    stroke(ctx, circle_pts(W / 2, cy + 5, nw / 2 + 50, 1.08, 120, -2.9, 700, ry=110), prog(t, a0 + 0.7, a0 + 1.4), 5, CYAN, 1, 700, frame, 2.0)
    ar = text_sprite('علي مبارك', 'Plex-700.ttf', 56, (170, 220, 255))
    draw_sprite(ctx, ar, W / 2, cy + 175, alpha=ease_out(prog(t, a0 + 0.8, a0 + 1.2)))
    hd = text_sprite('@alimubarak1', 'Inter-500.ttf', 44, (120, 200, 255))
    draw_sprite(ctx, hd, W / 2, cy + 255, alpha=ease_out(prog(t, a0 + 1.0, a0 + 1.4)))
    cta = text_sprite('تابعني لمزيد من الذكريات', 'Plex-700.ttf', 40, (255, 255, 255))
    cp = prog(t, a0 + 1.3, a0 + 1.7)
    w, h = cta.get_width() + 80, 78
    ctx.save(); ctx.translate(W / 2, cy + 370); s = 0.8 + 0.2 * ease_back(cp); ctx.scale(s, s); ctx.translate(-W / 2, -(cy + 370))
    rrect_path(ctx, W / 2 - w / 2, cy + 370 - h / 2, w, h, h / 2); ctx.set_source_rgba(*NAVY_CHIP, 0.95 * cp); ctx.fill()
    stroke(ctx, rrect_pts(W / 2 - w / 2, cy + 370 - h / 2, w, h, h / 2), cp, 3.5, CYAN, cp, 710, frame, 1.3)
    draw_sprite(ctx, cta, W / 2, cy + 370, alpha=cp)
    ctx.restore()
    arrow(ctx, (W / 2 + w / 2 + 60, cy + 470), (W / 2 + w / 2 + 10, cy + 395), prog(t, a0 + 1.6, a0 + 2.1), YELLOW, 5, 0.4, 720, frame)
    for i, (x, y) in enumerate([(160, cy - 140), (930, cy - 120), (200, cy + 300)]):
        sparkle(ctx, x, y, 14 + 5 * math.sin(t * 4 + i), [WHITE, CYAN, YELLOW][i], ease_out(prog(t, a0 + 0.9 + i * 0.15, a0 + 1.3 + i * 0.15)), 740 + i * 10, frame)

def render_frame(ctx, t, frame, surf):
    draw_background(ctx, t, frame)
    out = prog(t, ENDCARD, ENDCARD + 0.5)
    fade = 1 - out
    draw_header(ctx, t, frame, fade)
    appear = ease_out(prog(t, 0, 0.6))
    scale = (0.92 + 0.08 * ease_back(prog(t, 0, 0.7))) * (1 - 0.12 * ease_in_out(out))
    draw_footage(ctx, surf, t, frame, appear * fade, scale)
    if fade > 0:
        draw_replay(ctx, t, frame)
        draw_goal_annotation(ctx, t, frame)
        draw_hearts(ctx, t, frame)
        draw_bursts(ctx, t, frame)
    draw_progress(ctx, t, frame, fade)
    draw_chips(ctx, t, frame, fade)
    draw_signature(ctx, t, frame, fade)
    draw_endcard(ctx, t, frame)

def main():
    global GLOW, GPAD
    GLOW, GPAD = make_glow()
    src, out = sys.argv[1], sys.argv[2]
    preview = None
    if len(sys.argv) > 3 and sys.argv[3] == '--preview':
        preview = [float(x) for x in sys.argv[4].split(',')]
    canvas = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(canvas)
    fstride = cairo.ImageSurface.format_stride_for_width(cairo.FORMAT_ARGB32, FW)
    vf = f'crop=1076:730:2:596,scale={FW}:{FH}:flags=lanczos,format=bgra'

    def read_frame(proc):
        raw = proc.stdout.read(FW * FH * 4)
        if len(raw) < FW * FH * 4: return None
        return cairo.ImageSurface.create_for_data(bytearray(raw), cairo.FORMAT_ARGB32, FW, FH, fstride)

    if preview:
        for t in preview:
            surf = None
            if t < SRC_DUR - 0.05:
                p = subprocess.Popen([FFMPEG, '-loglevel', 'error', '-ss', str(t), '-i', src, '-frames:v', '1', '-vf', vf,
                                      '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
                surf = read_frame(p); p.wait()
            render_frame(ctx, t, int(t * FPS), surf)
            canvas.write_to_png(f'{out}_{t:05.1f}.png')
        return

    dec = subprocess.Popen([FFMPEG, '-loglevel', 'error', '-i', src, '-vf', vf, '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen([FFMPEG, '-loglevel', 'error', '-y',
                            '-f', 'rawvideo', '-pix_fmt', 'bgra', '-s', f'{W}x{H}', '-r', '30000/1001', '-i', '-',
                            '-i', src, '-map', '0:v', '-map', '1:a',
                            '-af', f'afade=t=in:st=0:d=0.4,afade=t=out:st={SRC_DUR - 1.2}:d=1.2,apad',
                            '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
                            '-c:a', 'aac', '-b:a', '192k', '-t', f'{END}', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    n = int(END * FPS)
    surf = None; alive = True
    for frame in range(n):
        t = frame / FPS
        if alive:
            s = read_frame(dec)
            if s is None: alive = False
            else: surf = s
        cur = surf if alive else None
        render_frame(ctx, t, frame, cur)
        canvas.flush()
        enc.stdin.write(bytes(canvas.get_data()))
        if frame % 300 == 0: print(f'{frame}/{n}', flush=True)
    enc.stdin.close(); enc.wait(); dec.kill()
    print('done', out)

if __name__ == '__main__':
    main()
