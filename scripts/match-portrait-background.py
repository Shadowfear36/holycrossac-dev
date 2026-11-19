"""
Give a clergy/vestry portrait the same backdrop as Fr. Dave's headshot, without altering the person.

Setup (one time; runs fully on this computer, photos are never uploaded):
    python -m venv .venv-rembg
    .venv-rembg/Scripts/python -m pip install "rembg[cpu]" pillow-heif   (first run downloads a ~176 MB model)

Usage:
    .venv-rembg/Scripts/python scripts/match-portrait-background.py \
        photos/library/<name>.jpg photos/library/fr-dave-portrait.jpg photos/library/<name>-matched.jpg [preview.jpg] \
        [--soft-hair=0.52]            # smooth + feather the hair outline in the head area (top 52% of the photo)
        [--keep-largest]              # keep only the person; drops detached scraps (frame corners, flecks)
        [--grey-hair=0.3]             # restore grey/white hair cut off against a coloured wall (top 30% of the photo)
        [--erase-light="x0,y0,x1,y1;..."]  # erase non-dark/red objects touching dark hair inside boxes (fractions)
        [--erase-white=x0,y0,x1,y1]   # remove white objects in an area (fractions); can nibble light clothing, so
                                      # cropping the object out of frame is usually better

Tips: frame like Fr. Dave's (2:3, head and shoulders). Plain-wall photos need no options; busy outdoor
backgrounds benefit from --soft-hair. Used for Melinda Barrow (Nov 2026): cropped to 2:3 first (to leave out
a chair), then --soft-hair=0.52.

How it works:
- Person cut out locally with rembg (u2net_human_seg) + alpha matting.
- Fully-opaque person pixels are copied unchanged. Only edge pixels are cleaned
  (the old background's colour removed) so no halo or leftover background shows.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageOps
from rembg import remove, new_session

args = [a for a in sys.argv[1:] if not a.startswith("--")]
opts = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
src, ref, out = args[0], args[1], args[2]
preview_path = args[3] if len(args) > 3 else None
person = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
w, h = person.size
I = np.asarray(person).astype(np.float32)

# 1) Cut-out
session = new_session("u2net_human_seg")
cut = remove(person, session=session, alpha_matting=True,
             alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=12,
             alpha_matting_erode_size=8)
a = np.asarray(cut.getchannel("A")).astype(np.float32) / 255.0

# 1a) Optional (--grey-hair=<fraction of height>): grey/white hair against a coloured wall (e.g. red brick)
#     is sometimes cut off. Restore low-colour pixels in the top of the photo that touch the head,
#     then smooth them into a natural outline (thin wall lines such as mortar are dropped).
if "grey-hair" in opts:
    top = int(h * float(opts["grey-hair"]))
    hsv0 = np.asarray(person.convert("HSV")).astype(np.float32)
    greyish = (hsv0[..., 1] / 255 < 0.22) & (hsv0[..., 2] / 255 > 0.30)
    head0 = Image.fromarray(((a > 0.5) * 255).astype(np.uint8), "L")
    near = np.asarray(head0.filter(ImageFilter.MaxFilter(41))) > 0
    add = greyish & near
    add[top:] = False
    add_img = Image.fromarray((add * 255).astype(np.uint8), "L")
    add = np.asarray(add_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(7))) > 0   # drop thin lines
    merged = Image.fromarray((((a > 0.5) | add) * 255).astype(np.uint8), "L")
    merged = merged.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))                 # close small gaps
    a = np.maximum(a, (np.asarray(merged) > 0).astype(np.float32) * (np.arange(h)[:, None] < top))

# 1b) Cleanup of leftovers from busy backgrounds (only near the outline, never inside the person)
solid = Image.fromarray(((a > 0.5) * 255).astype(np.uint8), "L")
outer = np.asarray(solid.filter(ImageFilter.MaxFilter(31))) > 0
inner = np.asarray(solid.filter(ImageFilter.MinFilter(31))) > 0
band = outer & ~inner                                   # ~15px either side of the outline
hsv = np.asarray(person.convert("HSV")).astype(np.float32)
hue, sat = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255
leafy_or_sky = ((hue > 55) & (hue < 300) & (sat > 0.20))  # green foliage / blue-violet sky (not grey/blonde hair or skin)
if "grey-hair" not in opts:  # (bluish-grey hair would be mistaken for sky)
    leafy_or_sky |= (hue > 185) & (hue < 270) & (sat > 0.08)  # faint, washed-out sky blue (hair and skin are never blue)
upper = np.zeros_like(band); upper[: int(h * 0.62)] = True  # head & neck area only (clothing below may be coloured)
a[band & leafy_or_sky & upper] = 0.0
# optional: erase light, low-colour pixels (e.g. a white chair) inside a box given as fractions
if "erase-white" in opts:
    x0, y0, x1, y1 = [float(v) for v in opts["erase-white"].split(",")]
    box = np.zeros_like(band); box[int(y0 * h): int(y1 * h), int(x0 * w): int(x1 * w)] = True
    whiteish = (hsv[..., 2] / 255 > 0.72) & (sat < 0.18)
    a[box & whiteish] = 0.0
# optional: erase background objects next to dark hair (e.g. a picture frame touching the head) inside
# boxes "x0,y0,x1,y1;x0,y0,x1,y1" (fractions): anything not dark (hair) or that is strongly red goes
if "erase-light" in opts:
    lum = I @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    redish = (I[..., 0] - I[..., 1]) > 45
    for spec in opts["erase-light"].split(";"):
        x0, y0, x1, y1 = [float(v) for v in spec.split(",")]
        ebox = np.zeros_like(band); ebox[int(y0 * h): int(y1 * h), int(x0 * w): int(x1 * w)] = True
        a[ebox & ((lum > 110) | redish)] = 0.0
# remove thin strands/specks left along the outline: a morphological "opening" (shrink then regrow),
# applied only in the outline band (and in the erase box), so the body of the person is unaffected
def opening(img_f, size):
    im8 = Image.fromarray((img_f * 255).astype(np.uint8), "L")
    return np.asarray(im8.filter(ImageFilter.MinFilter(size)).filter(ImageFilter.MaxFilter(size)), dtype=np.float32) / 255.0
opened = opening(a, 7)
clean_zone = band.copy()
if "erase-white" in opts:
    clean_zone |= box
    opened_box = opening(a, 15)
    a[box] = np.minimum(a, opened_box)[box]
a[clean_zone] = np.minimum(a, opened)[clean_zone]
# optional: keep only the person (largest connected piece); drops detached scraps such as
# a picture frame behind the head or a stray fleck beside the hair
if "keep-largest" in sys.argv[1:]:
    from scipy import ndimage
    lab, n = ndimage.label(a > 0.35)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(a), lab, index=np.arange(1, n + 1))
        main = lab == (int(np.argmax(sizes)) + 1)
        near = np.asarray(Image.fromarray((main * 255).astype(np.uint8), "L").filter(ImageFilter.MaxFilter(5))) > 0
        a[~near] = 0.0
# soften very slightly so cleaned edges don't look cut out
a = np.asarray(Image.fromarray((a * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.8)), dtype=np.float32) / 255.0

# 2) Backdrop from Fr. Dave's photo: vertical profile of the pure backdrop (outer strips, above shoulders)
r = np.asarray(Image.open(ref).convert("RGB")).astype(np.float32)
rh, rw = r.shape[:2]
strips = np.concatenate([r[:, : int(rw * 0.08)], r[:, int(rw * 0.92):]], axis=1)
pure_rows = int(rh * 0.40)                      # safely above his shoulders
prof = strips[:pure_rows].mean(axis=1)           # (pure_rows, 3)
# smooth it, then map onto this photo: top 40% follows his profile, the rest holds the last (lightest) tone
k = 31
pad = np.pad(prof, ((k, k), (0, 0)), mode="edge")
prof = np.stack([np.convolve(pad[:, c], np.ones(k) / k, mode="same")[k:-k] for c in range(3)], axis=1)
ys = np.linspace(0, 1, h)
src_y = np.clip(ys / 0.40, 0, 1) * (pure_rows - 1)
col = np.stack([np.interp(src_y, np.arange(pure_rows), prof[:, c]) for c in range(3)], axis=1)
bg = np.repeat(col[:, None, :], w, axis=1)
x = np.linspace(-1, 1, w)[None, :, None]
bg = bg * (1.0 + 0.05 * (1 - x ** 2))           # soft studio-light falloff to the sides
bg = bg + np.random.default_rng(7).normal(0, 1.4, bg.shape)  # faint grain, like a real backdrop

# 3) Estimate the ORIGINAL background colour near each edge pixel (normalised blur of pure-background pixels)
bgmask = (a < 0.05).astype(np.float32)
def blur(img8, rad):
    """Gaussian blur of a uint8 image (2D or RGB) -> float32."""
    if img8.ndim == 2:
        return np.asarray(Image.fromarray(img8, "L").filter(ImageFilter.GaussianBlur(rad)), dtype=np.float32)
    return np.asarray(Image.fromarray(img8, "RGB").filter(ImageFilter.GaussianBlur(rad)), dtype=np.float32)
num = blur((I * bgmask[..., None]).clip(0, 255).astype(np.uint8), 25)
den = blur((bgmask * 255).astype(np.uint8), 25)[..., None] / 255.0 + 1e-4
B_orig = num / den

# 4) Decontaminate only semi-transparent edge pixels: F = (I - (1-a) * B_orig) / a
edge = (a > 0.02) & (a < 0.98)
F = I.copy()
aa = np.clip(a, 0.15, 1.0)[..., None]           # avoid blow-up on the faintest wisps
F_edge = (I - (1 - aa) * B_orig) / aa
F[edge] = np.clip(F_edge[edge], 0, 255)

# 4b) Optional soft hair edge (--soft-hair=<fraction of height covering the head>, e.g. 0.58):
#     smooth the outline, feather it, and colour the fringe with the person's own nearby hair colour
#     (so nothing of the old background shows). Pixels well inside the outline stay original.
if "soft-hair" in opts:
    head_bottom = int(h * float(opts["soft-hair"]))
    radius = float(opts.get("soft-radius", max(3.0, w / 260)))       # feather width scales with image size
    def g(img_f, rad):
        im8 = Image.fromarray((np.clip(img_f, 0, 1) * 255).astype(np.uint8), "L")
        return np.asarray(im8.filter(ImageFilter.GaussianBlur(rad)), dtype=np.float32) / 255.0
    hard = (a > 0.5).astype(np.float32)
    smooth_outline = (g(hard, radius * 1.6) > 0.5).astype(np.float32)   # removes jaggies and stray flecks
    soft = g(smooth_outline, radius)                                     # gentle fade at the edge
    # interior = comfortably inside the smoothed outline: keep original pixels here
    interior = g(smooth_outline, radius * 2.2) > 0.97
    # hair colour just inside the edge, spread outward (normalised blur of interior pixels)
    inner8 = (interior[..., None] * I).clip(0, 255).astype(np.uint8)
    num = np.stack([np.asarray(Image.fromarray(inner8[..., c], "L").filter(ImageFilter.GaussianBlur(radius * 3)), dtype=np.float32) for c in range(3)], axis=2)
    den = np.asarray(Image.fromarray((interior * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(radius * 3)), dtype=np.float32)[..., None] / 255.0 + 1e-4
    hair_col = num / den
    head = np.zeros((h, w), bool); head[:head_bottom] = True
    # soften only where the edge is HAIR (low-colour grey/blonde), not skin (warmer, more saturated),
    # so faces and necks keep a crisp natural edge
    sat_o = np.asarray(person.convert("HSV"), dtype=np.float32)[..., 1] / 255.0
    hairlike = interior & (sat_o < 0.30)
    hb = lambda m: np.asarray(Image.fromarray((m * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(radius * 4)), dtype=np.float32) / 255.0
    hairness = np.clip((hb(hairlike.astype(np.float32)) / (hb(interior.astype(np.float32)) + 1e-4) - 0.35) / 0.4, 0, 1)
    # blend region just below the head so the change isn't a visible line
    ramp = np.clip((np.arange(h) - head_bottom) / max(1, int(h * 0.02)), 0, 1)[:, None]
    weight = np.where(head, 1.0, 1.0 - ramp) * hairness   # head area, hair edges only, fading out below
    new_a = soft
    # fringe colour: real pixel where the original matte was confident, otherwise the hair colour
    conf = np.clip((a - 0.75) / 0.25, 0, 1)[..., None] ** 2   # only trust very confident original pixels at the edge
    fringe = F * conf + hair_col * (1 - conf)
    fringe[interior] = I[interior]
    F = F * (1 - weight[..., None]) + fringe * weight[..., None]
    a = a * (1 - weight) + new_a * weight
    a[interior & head & (hairness > 0)] = 1.0
    # outline smoothing (not feathering) for the whole head area, hair or skin:
    # anything outside the smoothed outline (stray flecks, jagged bits) is removed
    keep = g(smooth_outline, 1.2)                         # crisp, smoothed edge
    head_w = np.where(head, 1.0, 1.0 - ramp)
    a = a * (1 - head_w) + np.minimum(a, keep) * head_w

# 5) Composite: interior person pixels (a≈1) are copied exactly
comp = F * a[..., None] + bg * (1 - a[..., None])
solid = a >= 0.98
comp[solid] = I[solid]
result = Image.fromarray(comp.clip(0, 255).astype(np.uint8))
result.save(out, "JPEG", quality=90, progressive=True, optimize=True)
if preview_path:
    prev = Image.new("RGB", (w * 2 + 20, h), (255, 255, 255))
    prev.paste(person, (0, 0)); prev.paste(result, (w + 20, 0))
    prev.thumbnail((1400, 1400)); prev.save(preview_path, quality=80)
print("done", out, result.size)
