/**
 * Cloudflare Pages Function: GET /api/gallery
 * Lists the photos in the parish's Google Drive gallery folder live, so a photo dropped into the
 * folder shows on the Parish Life page within a few minutes. Settings: src/content/site.ts → galleryDrive.
 * (Cloudflare bundles this file and its imports automatically on deploy.)
 */
import { site } from "../../src/content/site.ts";
import { folderListUrl, photosFromFolderPage } from "../../src/lib/driveFolder.ts";

const FRESH_SECONDS = 300; // re-read Google at most every 5 minutes

export async function onRequestGet() {
  if (!site.galleryDrive.enabled) {
    return Response.json({ updated: new Date().toISOString(), photos: [], disabled: true });
  }
  try {
    const res = await fetch(folderListUrl(site.galleryDrive.folderId), {
      cf: { cacheTtl: FRESH_SECONDS, cacheEverything: true },
    });
    if (!res.ok) throw new Error(`Google Drive responded ${res.status}`);
    const photos = photosFromFolderPage(await res.text());
    return Response.json(
      { updated: new Date().toISOString(), photos },
      { headers: { "Cache-Control": `public, max-age=${FRESH_SECONDS}` } },
    );
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 502 });
  }
}
