import { site } from "@/content/site";
import { folderListUrl, photosFromFolderPage, type DrivePhoto } from "@/lib/driveFolder";

/**
 * Build-time snapshot of the parish Google Drive gallery folder → /gallery-feed.json.
 * Backup for the live version (functions/api/gallery.js on Cloudflare), and what `npm run dev` uses.
 * If Drive can't be reached at build time, it's an empty list.
 */
export const dynamic = "force-static";

export async function GET() {
  let photos: DrivePhoto[] = [];
  if (site.galleryDrive.enabled) {
    try {
      const res = await fetch(folderListUrl(site.galleryDrive.folderId));
      if (res.ok) photos = photosFromFolderPage(await res.text());
    } catch {
      // offline at build time: leave empty; the live endpoint covers it on the real site
    }
  }
  return Response.json({ updated: new Date().toISOString(), photos });
}
