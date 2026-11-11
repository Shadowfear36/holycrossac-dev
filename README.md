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
- **Photos:** drop files in `public/photos/` (see `public/photos/README.md` for names)
- See `CONTENT-NEEDED.md` for what the parish still needs to supply. Nothing on the site is invented; gaps show a "Content needed" box.

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
