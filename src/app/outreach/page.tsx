import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import { outreach } from "@/content/site";

export const metadata: Metadata = { title: "Outreach Ministries" };

export default function Outreach() {
  return (
    <>
      <PageHero eyebrow="Connect" title="Outreach Ministries" />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <ul className="space-y-14">
          {outreach.map((m, i) => (
            <li key={m.id} id={m.id} className="grid items-center gap-8 md:grid-cols-5">
              {/* Photo appears automatically once public/photos/<m.photo>.jpg is added */}
              <Photo
                name={m.photo}
                alt={m.name}
                optional
                className={`aspect-[4/3] w-full md:col-span-2 ${i % 2 ? "md:order-2" : ""}`}
              />
              <div className="md:col-span-3">
                <div className="ornament max-w-[8rem] justify-start text-gold [&::before]:hidden">✠</div>
                <h2 className="mt-2 text-4xl">{m.name}</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-soft">{m.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-20 border-t border-gold/30 pt-10 text-center">
          <Link
            href="/contact/"
            className="inline-block bg-oxblood px-7 py-3 text-xs font-semibold uppercase tracking-wider text-parchment hover:bg-oxblood-dark"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
