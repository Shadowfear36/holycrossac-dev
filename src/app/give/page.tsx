import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Give" };

export default function Give() {
  return (
    <>
      <PageHero eyebrow="Give" title="Give" />
      <section className="mx-auto max-w-4xl px-6 py-20">
        {site.givingUrl ? (
          <a href={site.givingUrl} className="inline-block bg-oxblood px-8 py-4 text-sm font-semibold uppercase tracking-wider text-parchment hover:bg-oxblood-dark">
            Give online
          </a>
        ) : (
          // Fr. Dave (Nov 2026): show "work in progress" until online giving is set up
          <div className="border-t-2 border-gold paper-deep p-8 text-center">
            <p className="font-display text-3xl">Online giving is a work in progress.</p>
            <p className="mt-3 text-lg text-ink-soft">Please check back soon.</p>
          </div>
        )}
      </section>
    </>
  );
}
