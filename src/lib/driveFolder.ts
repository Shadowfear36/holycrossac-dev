/**
 * List the photos in a publicly shared Google Drive folder ("Anyone with the link can view"),
 * using Google's public folder page (drive.google.com/embeddedfolderview), so no API key is needed.
 * Shared by the build (snapshot) and the live Cloudflare Pages Function (functions/api/gallery.js),
 * so it must not depend on Next.js or Node-only APIs (it uses only fetch-era web APIs:
 * TextDecoder and DecompressionStream).
 *
 * Photos are recognised by Drive's file type, so a photo named "Campfire Compline" (no .jpg) still counts.
 *
 * Captions (the parish's own words, never made up):
 *   1. a caption file with the same name as the photo: a Word document ("Campfire Compline.docx"),
 *      a text file ("Campfire Compline.txt") or a Google Doc ("Campfire Compline");
 *   2. otherwise the photo's file name, when someone has named it (e.g. "Blessing of the Animals 2026.jpg").
 *      Camera names like IMG_1234.jpg get no caption.
 */

export type DrivePhoto = { id: string; name: string; src: string; thumb: string; caption?: string };

const IMAGE_EXT = /\.(jpe?g|png|webp|heic|heif|gif)$/i;
// e.g. IMG_1234, PXL_20261122_181503123, Screenshot 2026-11-22 at 10.03.22, WhatsApp Image 2026-11-22 at 9.15.02 AM (1)
const CAMERA_NAME =
  /^(img|dsc|dscn|dcim|pxl|mvimg|photo|image|screenshot|whatsapp image|fb_img|received|signal|snapchat)[\s\d_.:,()-]*(at[\s\d_.:,()-]*)?([ap]m[\s\d()]*)?$/i;

export const folderListUrl = (folderId: string) => `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}`;

/** Google serves a resized copy of any publicly shared image at this address. */
const imageUrl = (id: string, width: number) => `https://lh3.googleusercontent.com/d/${id}=w${width}`;
const downloadUrl = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`;

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function captionFrom(name: string): string | undefined {
  const base = name.replace(IMAGE_EXT, "").trim();
  if (!/[a-z]/i.test(base) || CAMERA_NAME.test(base)) return undefined;
  return base.replace(/_+/g, " ").replace(/\s+/g, " ").trim();
}

type Entry = { id: string; name: string; href: string; mime: string };

function entriesFromFolderPage(html: string): Entry[] {
  const out: Entry[] = [];
  const seen = new Set<string>();
  // each file is <div class="flip-entry" id="entry-<file id>"> <a href="…"> … <img src="…/type/<mime type>">
  //   … <div class="flip-entry-title">name</div>
  for (const part of html.split(/(?=<div[^>]*\bid="entry-)/)) {
    const id = part.match(/\bid="entry-([\w-]{10,})"/)?.[1];
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const href = decode(part.match(/<a[^>]*href="([^"]*)"/)?.[1] ?? "");
    const mime = decode(part.match(/\/type\/([\w.+-]+\/[\w.+-]+)/)?.[1] ?? "").toLowerCase();
    const name = decode(part.match(/flip-entry-title"?[^>]*>([^<]*)</)?.[1]?.trim() ?? "");
    out.push({ id, name, href, mime });
  }
  return out;
}

const isFolder = (e: Entry) => /\/folders\//.test(e.href) || e.mime.includes("folder");
const isImage = (e: Entry) => !isFolder(e) && (e.mime.startsWith("image/") || IMAGE_EXT.test(e.name));

/** "Campfire Compline.docx" and "Campfire Compline" (a JPEG) share the key "campfire compline". */
const baseName = (n: string) => n.replace(/\.(docx|txt|jpe?g|png|webp|heic|heif|gif)$/i, "").trim().toLowerCase();

type CaptionFile = { url: string; kind: "text" | "docx" };
function captionFile(e: Entry): CaptionFile | undefined {
  if (isFolder(e) || isImage(e)) return undefined;
  if (/\/document\/d\//.test(e.href) || e.mime === "application/vnd.google-apps.document")
    return { url: `https://docs.google.com/document/d/${e.id}/export?format=txt`, kind: "text" };
  if (/\.docx$/i.test(e.name) || e.mime.includes("wordprocessingml")) return { url: downloadUrl(e.id), kind: "docx" };
  if (/\.txt$/i.test(e.name) || e.mime === "text/plain") return { url: downloadUrl(e.id), kind: "text" };
  return undefined;
}

// ---- reading a Word (.docx) file: a zip archive; the text is in word/document.xml ----
async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function zipEntry(zip: Uint8Array, wanted: string): Promise<Uint8Array | undefined> {
  const v = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  // end of central directory record (search back from the end)
  let eocd = -1;
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 65557); i--) {
    if (v.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return undefined;
  const count = v.getUint16(eocd + 10, true);
  let p = v.getUint32(eocd + 16, true);
  const td = new TextDecoder();
  for (let n = 0; n < count && v.getUint32(p, true) === 0x02014b50; n++) {
    const method = v.getUint16(p + 10, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true);
    const extraLen = v.getUint16(p + 30, true);
    const commentLen = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const name = td.decode(zip.subarray(p + 46, p + 46 + nameLen));
    if (name === wanted) {
      const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
      const raw = zip.subarray(start, start + size);
      if (method === 0) return raw;
      if (method === 8) return inflateRaw(raw);
      return undefined;
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return undefined;
}

async function docxText(bytes: ArrayBuffer): Promise<string> {
  const xml = await zipEntry(new Uint8Array(bytes), "word/document.xml");
  if (!xml) return "";
  const doc = new TextDecoder().decode(xml);
  const paragraphs = doc.match(/<w:p[\s>][\s\S]*?<\/w:p>/g) ?? [];
  return paragraphs
    .map((p) =>
      decode(
        (p.match(/<w:t(?:\s[^>]*)?>[^<]*<\/w:t>|<w:tab\/>|<w:br\/>/g) ?? [])
          .map((t) => (t.startsWith("<w:tab") ? " " : t.startsWith("<w:br") ? "\n" : t.replace(/<[^>]+>/g, "")))
          .join(""),
      ),
    )
    .join("\n");
}

const cleanCaption = (t: string) =>
  t
    .replace(/^﻿/, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim()
    .slice(0, 400) || undefined;

/**
 * Photos in the folder, with captions from matching caption files.
 * `fetchBytes` downloads a URL (passed in so the live function can use Cloudflare's cache).
 */
export async function photosFromFolder(html: string, fetchBytes: (url: string) => Promise<ArrayBuffer>): Promise<DrivePhoto[]> {
  const entries = entriesFromFolderPage(html);
  const captions = new Map<string, string>();
  await Promise.all(
    entries.map(async (e) => {
      const file = captionFile(e);
      if (!file) return;
      try {
        const bytes = await fetchBytes(file.url);
        const text = file.kind === "docx" ? await docxText(bytes) : new TextDecoder().decode(bytes);
        const caption = cleanCaption(text);
        if (caption) captions.set(baseName(e.name), caption);
      } catch {
        // unreadable caption file: fall back to the file-name rule
      }
    }),
  );
  return entries.filter(isImage).map((e) => ({
    id: e.id,
    name: e.name,
    src: imageUrl(e.id, 2000),
    thumb: imageUrl(e.id, 900),
    caption: captions.get(baseName(e.name)) ?? captionFrom(e.name),
  }));
}
