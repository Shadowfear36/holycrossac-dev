"""
Generates the site icons and social share (Open Graph) cards.

    python scripts/make-brand-images.py

Outputs (Next.js picks up the files in src/app/ automatically):
  src/app/favicon.ico            16/32/48 browser tab icon
  src/app/icon.png               512 site icon
  src/app/apple-icon.png         180 iPhone home-screen icon
  public/icons/icon-192.png      PWA / Android
  public/icons/icon-512.png
  public/icons/maskable-512.png  Android adaptive icon (extra padding)
  src/app/opengraph-image.jpg    1200x630 link preview (Facebook, iMessage, etc.)
  src/app/twitter-image.jpg      same card for X/Twitter

Fonts: IM Fell English (SIL Open Font License), in scripts/fonts/.
Photo: photos/library/holy-cross-and-emmanuel-clergy.jpg
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)

PARCHMENT = (244, 236, 216)
OXBLOOD = (138, 28, 36)
OXBLOOD_DARK = (92, 18, 25)
GOLD = (176, 141, 60)
GOLD_LIGHT = (216, 192, 138)
INK = (31, 27, 24)

FELL = P("scripts", "fonts", "IMFellEnglish-Regular.woff2")
FELL_I = P("scripts", "fonts", "IMFellEnglish-Italic.woff2")
FELL_SC = P("scripts", "fonts", "IMFellEnglishSC-Regular.woff2")


def jerusalem_cross(draw, x, y, size, fill):
    """Same geometry as src/components/CrossMark.tsx (40-unit grid)."""
    u = size / 40

    def r(a, b, w, h):
        draw.rectangle([x + a * u, y + b * u, x + (a + w) * u - 1, y + (b + h) * u - 1], fill=fill)

    r(18, 3, 4, 34); r(3, 18, 34, 4)            # central cross
    r(12.5, 3, 15, 3); r(12.5, 34, 15, 3)       # potent ends
    r(3, 12.5, 3, 15); r(34, 12.5, 3, 15)
    for cx, cy in [(10, 10), (30, 10), (10, 30), (30, 30)]:  # four small crosses
        r(cx - 1, cy - 3.5, 2, 7); r(cx - 3.5, cy - 1, 7, 2)


EMBLEM_RED = (196, 22, 30)
EMBLEM_RED_DARK = (142, 13, 19)
EMBLEM_GOLD = (201, 154, 62)


def emblem(draw, x, y, size, rim=1.3):
    """The parish emblem: red enamel cross with a continuous gold rim (as on the old site)."""
    u = size / 40
    rects = [(18, 3, 4, 34), (3, 18, 34, 4), (12.5, 3, 15, 3), (12.5, 34, 15, 3), (3, 12.5, 3, 15), (34, 12.5, 3, 15)]
    for cx, cy in [(10, 10), (30, 10), (10, 30), (30, 30)]:
        rects += [(cx - 1, cy - 3.5, 2, 7), (cx - 3.5, cy - 1, 7, 2)]
    r = rim / 2
    for a, b, w, h in rects:  # gold first, fattened
        draw.rectangle([x + (a - r) * u, y + (b - r) * u, x + (a + w + r) * u - 1, y + (b + h + r) * u - 1], fill=EMBLEM_GOLD)
    for a, b, w, h in rects:  # red on top
        draw.rectangle([x + a * u, y + b * u, x + (a + w) * u - 1, y + (b + h) * u - 1], fill=EMBLEM_RED)


def icon(size, pad_ratio=0.12, rounded=True, bg=PARCHMENT, fg=None):
    """Emblem on a parchment tile, drawn 4x then downsampled for crisp edges."""
    S = size * 4
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if rounded:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.18), fill=bg)
    else:
        d.rectangle([0, 0, S, S], fill=bg)
    pad = S * pad_ratio
    emblem(d, pad, pad, S - 2 * pad)
    return im.resize((size, size), Image.LANCZOS)


def make_icons():
    # Tab icon: no rounding at tiny sizes reads better; slightly tighter padding
    fav = [icon(s, pad_ratio=0.08, rounded=False) for s in (16, 32, 48)]
    fav[2].save(P("src", "app", "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)], append_images=fav[:2])
    icon(512).save(P("src", "app", "icon.png"))
    # Apple applies its own rounding; give it a full square
    icon(180, pad_ratio=0.16, rounded=False).convert("RGB").save(P("src", "app", "apple-icon.png"))
    icon(192).save(P("public", "icons", "icon-192.png"))
    icon(512).save(P("public", "icons", "icon-512.png"))
    icon(512, pad_ratio=0.24, rounded=False).save(P("public", "icons", "maskable-512.png"))
    print("icons done")


def fit_cover(im, w, h, focus=(0.5, 0.4)):
    im = ImageOps.exif_transpose(im).convert("RGB")
    scale = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left = int((im.width - w) * focus[0]); top = int((im.height - h) * focus[1])
    return im.crop((left, top, left + w, top + h))


def make_og():
    W, H = 1200, 630
    PANEL = 560  # lettering panel on the left; photo on the right, faces unobstructed

    card = Image.new("RGB", (W, H), INK)
    photo = fit_cover(Image.open(P("photos", "library", "holy-cross-and-emmanuel-clergy.jpg")), W - PANEL + 120, H, (0.30, 0.5))
    # Soft fade from the panel into the photo
    mask = Image.new("L", photo.size, 255)
    md = ImageDraw.Draw(mask)
    for x in range(120):
        md.line([(x, 0), (x, H)], fill=int(255 * (x / 120) ** 1.5))
    card.paste(photo, (PANEL - 120, 0), mask)

    d = ImageDraw.Draw(card)
    # Thin gold frame, like a printed page border
    d.rectangle([22, 22, W - 23, H - 23], outline=GOLD, width=2)

    emblem(d, 64, 66, 64)

    sc = ImageFont.truetype(FELL_SC, 28)
    big = ImageFont.truetype(FELL, 100)
    ital = ImageFont.truetype(FELL_I, 56)
    small = ImageFont.truetype(FELL, 30)

    d.text((64, 172), "Welcome to", font=sc, fill=GOLD_LIGHT)
    d.text((60, 202), "Holy Cross", font=big, fill=PARCHMENT)
    d.text((64, 314), "Anglican Church", font=ital, fill=PARCHMENT)
    d.line([(66, 404), (360, 404)], fill=GOLD, width=2)
    d.text((64, 424), "Sunday Worship · 9:30 a.m.", font=small, fill=PARCHMENT)
    d.text((64, 464), "828 O Street, Sanger, California", font=small, fill=GOLD_LIGHT)
    d.text((W - 40, H - 46), "Holy Cross and Emmanuel clergy", font=ImageFont.truetype(FELL_I, 20), fill=(*GOLD_LIGHT,), anchor="ra")

    for name in ("opengraph-image.jpg", "twitter-image.jpg"):
        card.save(P("src", "app", name), "JPEG", quality=86, progressive=True, optimize=True)
    alt = "Holy Cross Anglican Church, Sanger, California. Sunday Worship 9:30 a.m. Photo: Holy Cross and Emmanuel clergy."
    for name in ("opengraph-image.alt.txt", "twitter-image.alt.txt"):
        open(P("src", "app", name), "w", encoding="utf-8").write(alt)
    print("og cards done")


if __name__ == "__main__":
    make_icons()
    make_og()
