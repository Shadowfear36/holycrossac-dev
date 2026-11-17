# holycrossac.org

Website for Holy Cross Anglican Church, Sanger, CA. Built with Next.js (static export) and Tailwind, hosted on Cloudflare Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # outputs static site to ./out
```

## Editing content

- **Church info, service times, clergy, vestry, events, links:** `src/content/site.ts`
- **Photos:** page photos are in `public/photos/` (see its README); the full captioned library is in `photos/`
- **Parish Life gallery:** drop a .jpg into `public/photos/gallery/` and it appears on /parish-life/ automatically; add a caption/order in `src/content/gallery.ts`
- **Site icon & link-preview card:** `python scripts/make-brand-images.py` (needs Python + Pillow) regenerates them
- See `CONTENT-NEEDED.md` for what the parish still needs to supply. Nothing on the site is invented; gaps show a "Content needed" box.

## Home banner

- The church on O Street (`public/photos/hero-church.jpg`). Photo on the right on desktop, across the top on phones.

## Facebook & livestream

- **Latest YouTube videos:** `src/components/YouTubeLatest.tsx` embeds the channel's uploads playlist (newest first, updates itself; no API key). Channel ID is `youtubeChannelId` in `site.ts`.
- **Latest posts:** `src/components/FacebookFeed.tsx` embeds Facebook's official Page plugin (no login or API key). Livestreams appear there as posts. It only loads when scrolled near.
- **Live now / next livestream:** `src/components/LiveBanner.tsx`, driven by `livestreamSchedule` in `src/content/site.ts` (Sundays 9:30 a.m. Pacific). The header's "Watch Live" link becomes a pulsing "Live now" during that window. This is schedule-based; real-time detection would need a Facebook developer key from a page admin.

## Deploy (Cloudflare Pages)

Connect the Git repo in the Cloudflare dashboard (Workers & Pages → Create → Pages → Connect to Git):

- Build command: `npm run build`
- Build output directory: `out`
- Environment variable: `NODE_VERSION=22`

Then add the custom domain `holycrossac.org` under the project's **Custom domains** tab.

> **Keep church email working.** holycrossac.org's DNS is currently at Network Solutions (`ns1.aplus.net`), and its email
> (email@holycrossac.org) runs on Network Solutions mail servers. If the domain's DNS moves to Cloudflare, copy these records
> over exactly, or email stops: MX `mx1c40.carrierzone.com` (10), `mx2c40.carrierzone.com` (100), `mx3c40.carrierzone.com` (110),
> and TXT `v=spf1 a mx include:spfc40.carrierzone.com include:verticalresponse.com ~all`.
Old site URLs are redirected via `public/_redirects`.

Or deploy from the CLI: `npm run build && npx wrangler pages deploy`.

## Mail (later)

The contact form currently opens the visitor's email app (`mailto:`).
To send directly, add a Pages Function at `functions/api/contact.ts` and POST the form to it
(e.g. via Resend or Postmark), then update `src/components/ContactForm.tsx`.

## Parish calendar (Google Calendar)

Upcoming events can come straight from the parish Google Calendar (holycross4him@gmail.com), so whoever has edit access can update events without touching the code. It's built but switched off until the calendar is cleaned up. See [CALENDAR.md](CALENDAR.md).
