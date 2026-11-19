import type { Metadata } from "next";
import Link from "next/link";
import CrossMark from "@/components/CrossMark";
import { waysToGive } from "@/content/giving";
import { site } from "@/content/site";

/**
 * Quick giving page: where the bulletin QR code goes (print/giving-qr.png, scripts/make-giving-qr.mjs).
 * Hidden: not in the menus or the sitemap, and search engines are asked not to list it.
 */
export const metadata: Metadata = {
  title: "Give Now",
  robots: { index: false, follow: false },
};

export default function GiveNow() {
  const [plate, mail] = waysToGive;
  return (
    <section className="mx-auto max-w-xl px-6 py-16 text-center md:py-24">
      <CrossMark className="mx-auto h-14 w-14" />
      <h1 className="mt-6 text-5xl md:text-6xl">Give to Holy Cross</h1>
      <p className="mt-4 font-display text-xl italic text-ink-soft">Thank you for your generosity.</p>

      {site.givingUrl && (
        <div className="mt-10">
          <a
            href={site.givingUrl}
            className="block w-full bg-oxblood px-8 py-5 text-base font-semibold uppercase tracking-wider text-parchment shadow-md hover:bg-oxblood-dark"
          >
            Give online
          </a>
          <p className="mt-3 text-sm text-stone">Once or on a regular schedule, by card or bank.</p>
        </div>
      )}

      <div className="mt-14 space-y-6 text-left">
        <p className="eyebrow text-center">Other ways to give</p>
        <div className="border-t-2 border-gold paper p-6">
          <h2 className="text-2xl">In church</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">{plate.text}</p>
        </div>
        <div className="border-t-2 border-gold paper p-6">
          <h2 className="text-2xl">By mail</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">{mail.text}</p>
          <address className="mt-3 font-display text-lg not-italic leading-snug">
            {site.mailing.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
        </div>
      </div>

      <Link href="/give/" className="mt-12 inline-block font-semibold text-oxblood hover:underline">
        About tithes, alms and generosity →
      </Link>
    </section>
  );
}
