/**
 * Giving QR code with the Holy Cross Jerusalem cross in the middle, for the bulletin and the Give page.
 *
 *   node scripts/make-giving-qr.mjs
 *
 * Points to the hidden quick-giving page, <site url>/give-now/ (src/app/give-now), which links to
 * online giving and the other ways to give. Writes:
 *   print/giving-qr.svg   sharp at any size
 *   print/giving-qr.png   2000 x 2000 px, for the bulletin / Word / Publisher
 *   public/giving-qr.svg  shown on the Give page
 *
 * Uses the highest error correction (H, ~30%) so the cross in the centre (about 7% of the area)
 * never stops it scanning. Re-run this whenever the giving link changes.
 */
import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import sharp from "sharp";

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")));
const siteTs = fs.readFileSync(path.join(ROOT, "src/content/site.ts"), "utf8");
const siteUrl = siteTs.match(/url:\s*"(https?:[^"]+)"/)?.[1];
if (!siteUrl) throw new Error("site url not found in src/content/site.ts");
const url = `${siteUrl.replace(/\/$/, "")}/give-now/`;

// Church colours (src/app/globals.css): dark oxblood modules, oxblood corner "eyes", gold frame.
// Dark enough on white for every phone camera to read.
const OXBLOOD_DARK = "#5c1219";
const OXBLOOD = "#8a1c24";
const GOLD = "#b08d3c";
const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
const n = qr.modules.size;
const quiet = 4; // standard white margin, in modules
const size = n + quiet * 2;

// Centre logo area: a square of `hole` modules, kept clear of QR modules
let hole = Math.round(n * 0.27);
if ((n - hole) % 2) hole += 1;
const h0 = (n - hole) / 2;
const inHole = (r, c) => r >= h0 && r < h0 + hole && c >= h0 && c < h0 + hole;
// …but never cover the three corner finder patterns (they must stay intact)
const inFinder = (r, c) => (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8);

let modules = "";
let eyes = "";
for (let r = 0; r < n; r++) {
  for (let c = 0; c < n; c++) {
    if (!qr.modules.get(r, c) || (inHole(r, c) && !inFinder(r, c))) continue;
    const sq = `M${c + quiet},${r + quiet}h1v1h-1z`;
    if (inFinder(r, c)) eyes += sq;
    else modules += sq;
  }
}

// Jerusalem cross, same geometry as src/components/CrossMark.tsx (40-unit grid): gold rim, red enamel
const RECTS = [
  [18, 3, 4, 34], [3, 18, 34, 4], [12.5, 3, 15, 3], [12.5, 34, 15, 3], [3, 12.5, 3, 15], [34, 12.5, 3, 15],
  ...[[10, 10], [30, 10], [10, 30], [30, 30]].flatMap(([cx, cy]) => [[cx - 1, cy - 3.5, 2, 7], [cx - 3.5, cy - 1, 7, 2]]),
];
const rects = (attrs) => RECTS.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrs}/>`).join("");
const pad = 0.6; // modules of white around the cross
const box = hole - pad * 2;
const cross = `
  <g transform="translate(${quiet + h0 + pad} ${quiet + h0 + pad}) scale(${box / 42}) translate(1 1)">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3dd9a"/><stop offset="0.45" stop-color="#c99a3e"/><stop offset="1" stop-color="#8a6421"/></linearGradient>
      <linearGradient id="r" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#e8343a"/><stop offset="0.5" stop-color="#c4161e"/><stop offset="1" stop-color="#8e0d13"/></linearGradient>
    </defs>
    <g fill="url(#g)" stroke="url(#g)" stroke-width="1.6" stroke-linejoin="miter">${rects("")}</g>
    <g fill="url(#r)">${rects("")}</g>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">
  <title>Give to Holy Cross Anglican Church</title>
  <rect width="${size}" height="${size}" fill="#ffffff"/>
  <rect x="0.75" y="0.75" width="${size - 1.5}" height="${size - 1.5}" fill="none" stroke="${GOLD}" stroke-width="0.5"/>
  <path d="${modules}" fill="${OXBLOOD_DARK}"/>
  <path d="${eyes}" fill="${OXBLOOD}"/>
  <g shape-rendering="geometricPrecision">${cross}</g>
</svg>
`;

fs.mkdirSync(path.join(ROOT, "print"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "print/giving-qr.svg"), svg);
fs.writeFileSync(path.join(ROOT, "public/giving-qr.svg"), svg); // shown on the Give page
await sharp(Buffer.from(svg), { density: 2000 / size * 72 }).resize(2000, 2000).png().toFile(path.join(ROOT, "print/giving-qr.png"));
console.log(`QR for ${url}\n  ${n}x${n} modules, level H, centre ${hole}x${hole} → print/giving-qr.svg, print/giving-qr.png`);
