/**
 * List the photos in a publicly shared Google Drive folder ("Anyone with the link can view"),
 * using Google's public folder page (drive.google.com/embeddedfolderview), so no API key is needed.
 * Shared by the build (snapshot) and the live Cloudflare Pages Function (functions/api/gallery.js),
 * so it must not depend on Next.js or Node-only APIs.
 *
 * Captions: the file name, when someone has named the file (e.g. "Blessing of the Animals 2026.jpg").
 * Camera names like IMG_1234.jpg get no caption.
 */

export type DrivePhoto = { id: string; name: string; src: string; thumb: string; caption?: string };

const IMAGE = /\.(jpe?g|png|webp|heic|heif|gif)$/i;
// e.g. IMG_1234, PXL_20261122_181503123, Screenshot 2026-11-22 at 10.03.22, WhatsApp Image 2026-11-22 at 9.15.02 AM (1)
const CAMERA_NAME =
  /^(img|dsc|dscn|dcim|pxl|mvimg|photo|image|screenshot|whatsapp image|fb_img|received|signal|snapchat)[\s\d_.:,()-]*(at[\s\d_.:,()-]*)?([ap]m[\s\d()]*)?$/i;

export const folderListUrl = (folderId: string) => `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}`;

/** Google serves a resized copy of any publicly shared image at this address. */
const imageUrl = (id: string, width: number) => `https://lh3.googleusercontent.com/d/${id}=w${width}`;

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function captionFrom(name: string): string | undefined {
  const base = name.replace(/\.[^.]+$/, "").trim();
  if (!/[a-z]/i.test(base) || CAMERA_NAME.test(base)) return undefined;
  return base.replace(/_+/g, " ").replace(/\s+/g, " ").trim();
}

export function photosFromFolderPage(html: string): DrivePhoto[] {
  const out: DrivePhoto[] = [];
  const seen = new Set<string>();
  // each file is <div class="flip-entry" id="entry-<file id>"> … <div class="flip-entry-title">name</div>
  const parts = html.split(/(?=<div[^>]*\bid="entry-)/);
  for (const part of parts) {
    const id = part.match(/\bid="entry-([\w-]{10,})"/)?.[1];
    if (!id || seen.has(id)) continue;
    if (/\/folders\//.test(part.slice(0, 600))) continue; // a sub-folder, not a file
    const name = decode(part.match(/flip-entry-title"?[^>]*>([^<]*)</)?.[1]?.trim() ?? "");
    if (!IMAGE.test(name)) continue;
    seen.add(id);
    out.push({ id, name, src: imageUrl(id, 2000), thumb: imageUrl(id, 900), caption: captionFrom(name) });
  }
  return out;
}
