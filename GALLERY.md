# Parish Life photos

Photos put in the parish's Google Drive folder appear on the **Parish Life** page automatically,
ahead of the photos built into the site.

- **Folder:** "HolyCrossAC-Website-Gallery"
  https://drive.google.com/drive/folders/1DGfs3G6YtSM27NCEXdeOtMDTMdX1GIth
- **Status:** on (`galleryDrive` in `src/content/site.ts`).

## Adding a photo

1. Upload the photo (.jpg, .png, .heic from an iPhone, etc.) into the folder.
2. **Caption:** name the file what the caption should say, e.g. `Blessing of the Animals 2026.jpg`.
   Photos with camera names (`IMG_1234.jpg`, `PXL_…`, screenshots) show without a caption.
3. It appears on the live site within about **5 minutes**. To take a photo down, delete it from the folder
   (or move it out).

## Keep in mind

- **Anything in the folder is public.** There is no approval step: a photo goes live as soon as it's in the folder.
  Only give upload access to people who know this, and take care with photos of children.
- The folder must stay shared as **"Anyone with the link" → Viewer**, or the photos stop showing.
- Give someone upload access: open the folder → **Share** → add them as **Editor**.

## How it works (website)

- Live: `functions/api/gallery.js` (a Cloudflare Pages Function) reads the folder's public listing.
  Photos are shown from Google's servers; nothing is copied into the website.
- Backup: a snapshot is saved at each publish (`/gallery-feed.json`), also used by `npm run dev`.
- Photos in `public/photos/gallery/` (with captions in `src/content/gallery.ts`) still show, after the Drive photos.
