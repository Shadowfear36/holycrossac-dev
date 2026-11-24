import fs from "node:fs";
import path from "node:path";
import { galleryOrder } from "@/content/gallery";

export type GalleryPhoto = { src: string; thumb: string; caption?: string; alt: string; position?: string };

const EXTS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Read the gallery at build time: listed photos first (with captions), then any other
 * photos found in public/photos/gallery/, so new photos show up just by adding the file.
 */
export function getGallery(): GalleryPhoto[] {
  const dir = path.join(process.cwd(), "public", "photos", "gallery");
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => EXTS.includes(path.extname(f).toLowerCase()))
    .sort();
  const byBase = new Map(files.map((f) => [path.basename(f, path.extname(f)), f]));
  const listed = galleryOrder.filter((e) => byBase.has(e.file));
  const rest = [...byBase.keys()].filter((b) => !galleryOrder.some((e) => e.file === b)).map((file) => ({ file, caption: undefined, position: undefined }));

  return [...listed, ...rest].map(({ file, caption, position }) => {
    const name = byBase.get(file)!;
    const hasThumb = fs.existsSync(path.join(dir, "thumbs", name));
    return {
      src: `/photos/gallery/${name}`,
      thumb: hasThumb ? `/photos/gallery/thumbs/${name}` : `/photos/gallery/${name}`,
      caption,
      alt: caption ?? "Parish life at Holy Cross",
      position,
    };
  });
}
