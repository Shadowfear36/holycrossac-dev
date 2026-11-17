import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import { visitorGuide } from "@/content/newHere";

export const metadata: Metadata = { title: "I'm New Here" };

export default function NewHere() {
  return (
    <>
      <PageHero eyebrow="Welcome" title="I'm New Here" photo="hero-new-here" photoHint="Front doors / exterior of the church" photoPosition="60% 40%" />

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-5">
        <div className="md:col-span-3">
          <h2 className="text-4xl">{visitorGuide.heading}</h2>
          <div className="prose-church drop-cap mt-6 text-lg">
            <p>{visitorGuide.intro}</p>
          </div>
          <dl className="mt-4 divide-y divide-gold/25">
            {visitorGuide.items.map((item) => (
              <div key={item.title} className="py-6">
                <dt className="font-display text-2xl text-ink">{item.title.replace(/\.$/, "")}</dt>
                <dd className="mt-2 text-lg leading-relaxed text-ink-soft">{item.text}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 border-t border-gold/40 pt-8">
            <p className="font-display text-2xl italic">{visitorGuide.closing}</p>
            <p className="scripture-cite mt-3 text-xl text-oxblood">{visitorGuide.signature}</p>
          </div>
        </div>
        <aside className="space-y-8 md:col-span-2">
          <div className="md:sticky md:top-40 md:space-y-8">
            <ServiceCard />
            <div className="paper-deep mt-8 p-7 md:mt-0">
              <h2 className="text-2xl">Have a question?</h2>
              <Link href="/contact/" className="mt-3 inline-block font-semibold text-oxblood hover:underline">
                Contact us →
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
