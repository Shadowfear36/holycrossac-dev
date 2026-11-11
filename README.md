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
- **Site icon & link-preview card:** `python scripts/make-brand-images.py` (needs Python + Pillow) regenerates them
- See `CONTENT-NEEDED.md` for what the parish still needs to supply. Nothing on the site is invented; gaps show a "Content needed" box.

## Motion & interactivity

- **Home banner:** `src/components/HeroCross3D.tsx`. The parish emblem in real-time 3D (plain WebGL, no library). Drag to spin; falls back to the flat emblem without WebGL.
- **First-visit intro (home page):** the 3D cross starts alone in the middle of the screen, then glides into place as the page fades in. Script in `layout.tsx`, timeline in `HeroCross3D.tsx`, styles under "Intro" in `globals.css`. Once per visit; a CSS fail-safe reveals the page after 5s no matter what.
- Both respect the visitor's "reduce motion" setting.

## Deploy (Cloudflare Pages)

Connect the Git repo in the Cloudflare dashboard (Workers & Pages → Create → Pages → Connect to Git):

- Build command: `npm run build`
- Build output directory: `out`
- Environment variable: `NODE_VERSION=22`

Then add the custom domain `holycrossac.org` under the project's **Custom domains** tab.
Old site URLs are redirected via `public/_redirects`.

Or deploy from the CLI: `npm run build && npx wrangler pages deploy`.

## Mail (later)

The contact form currently opens the visitor's email app (`mailto:`).
To send directly, add a Pages Function at `functions/api/contact.ts` and POST the form to it
(e.g. via Resend or Postmark), then update `src/components/ContactForm.tsx`.
