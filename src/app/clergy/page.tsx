import type { Metadata } from "next";
import Needed from "@/components/Needed";
import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import { clergy, vestry } from "@/content/site";

export const metadata: Metadata = { title: "Clergy & Vestry" };

export default function Clergy() {
  return (
    <>
      <PageHero eyebrow="Welcome" title="Clergy & Vestry" />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow">Clergy</p>
        <div className="mt-8 space-y-16">
          {clergy.map((c) => (
            <article key={c.name} className="grid items-start gap-10 md:grid-cols-3">
              <Photo name={c.photo} alt={c.name} hint={`Portrait of ${c.name}`} position="50% 20%" className="aspect-[4/5] w-full" />
              <div className="md:col-span-2">
                <h2 className="text-4xl">{c.name}</h2>
                {c.role && <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-oxblood">{c.role}</p>}
                {c.bio ? (
                  <div className="prose-church mt-6"><p>{c.bio}</p></div>
                ) : (
                  <Needed className="mt-6">Full name, title, and a short biography.</Needed>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="paper-deep">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow">Vestry</p>
          <h2 className="mt-3 text-4xl">The Vestry</h2>
          {vestry.length ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vestry.map((v) => (
                <li key={v.name} className="border-t-2 border-gold paper p-6">
                  <p className="font-display text-2xl">{v.name}</p>
                  <p className="mt-1 text-sm text-stone">{v.role}</p>
                </li>
              ))}
            </ul>
          ) : (
            <Needed className="mt-8">Names and offices of vestry members.</Needed>
          )}
        </div>
      </section>
    </>
  );
}
