import type { Metadata } from "next";
import Needed from "@/components/Needed";
import PageHero from "@/components/PageHero";
import { resources, vestryDocumentCategories } from "@/content/site";

export const metadata: Metadata = { title: "Resources" };

export default function Resources() {
  return (
    <>
      <PageHero eyebrow="Connect" title="Resources" />
      <section className="mx-auto max-w-6xl space-y-16 px-6 py-20">
        {resources.map((g) => (
          <div key={g.group}>
            <h2 className="text-3xl">{g.group}</h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {g.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group block h-full border border-gold/30 transition-colors hover:border-oxblood hover:bg-parchment-deep"
                  >
                    <div className="flex h-44 items-center justify-center overflow-hidden paper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={l.image}
                        alt=""
                        loading="lazy"
                        className={l.fit === "cover" ? "h-full w-full object-cover" : "max-h-32 max-w-[70%] object-contain"}
                      />
                    </div>
                    <p className="p-5 font-display text-2xl group-hover:text-oxblood">{l.label} ↗</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div id="vestry-documents">
          <h2 className="text-3xl">Vestry Documents</h2>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {vestryDocumentCategories.map((c) => (
              <li key={c} className="border-b border-gold/25 py-2 text-ink-soft">{c}</li>
            ))}
          </ul>
          <Needed className="mt-6">
            The document files for each category (PDFs). They can go in <code>public/docs/</code>,
            or we can put them behind a password if they shouldn&apos;t be public.
          </Needed>
        </div>
      </section>
    </>
  );
}
