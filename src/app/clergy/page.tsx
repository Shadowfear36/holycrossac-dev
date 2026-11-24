import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import { clergy, vestry } from "@/content/site";

export const metadata: Metadata = { title: "Clergy, Staff & Vestry" };

export default function Clergy() {
  return (
    <>
      <PageHero eyebrow="Welcome" title="Clergy, Staff & Vestry" />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow">Clergy &amp; Staff</p>
        <div className="mt-8 space-y-16">
          {clergy.map((c) => (
            <article key={c.name} className="grid items-start gap-10 md:grid-cols-3">
              <Photo name={c.photo} alt={c.name} hint={`Portrait of ${c.name}`} position="50% 20%" className="aspect-[4/5] w-full" />
              <div className="md:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-wider text-oxblood">{c.role}</p>
                <h2 className="mt-2 text-4xl">{c.name}</h2>
                {c.credentials && <p className="mt-2 font-smallcaps text-lg tracking-wide text-stone">{c.credentials}</p>}
                {c.bio.length > 0 && (
                  <div className="prose-church drop-cap mt-6 text-lg">
                    {c.bio.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
                {c.source && (
                  <p className="mt-4 text-sm text-stone">
                    From the{" "}
                    <a href={c.source.href} className="text-oxblood underline-offset-2 hover:underline">
                      {c.source.label}
                    </a>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="paper-deep">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow">Vestry</p>
          <h2 className="mt-3 text-4xl">Members of the Vestry</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vestry.map((v) => (
              <li
                key={v.name}
                className={`border-t-2 border-gold paper p-6 ${v.bio ? "flex flex-col gap-6 sm:col-span-2 sm:flex-row lg:col-span-3" : ""}`}
              >
                {v.photo && (
                  <Photo
                    name={v.photo}
                    alt={v.name}
                    optional
                    position={v.photoPosition ?? "50% 22%"}
                    className={`aspect-square w-32 shrink-0 self-start sm:w-36 ${v.bio ? "" : "mb-5"}`}
                  />
                )}
                <div>
                  <p className="font-display text-2xl">{v.name}</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-oxblood">{v.role}</p>
                  {/* Same type for every bio (the parish's book face, upright for easy reading);
                      a member's own words get quotation marks */}
                  {v.bio && (
                    <div className="mt-4 max-w-3xl space-y-3 font-display text-xl leading-relaxed text-ink">
                      {v.bio.map((p, i) => (
                        <p key={i}>
                          {v.firstPerson && i === 0 ? "“" : ""}
                          {p}
                          {v.firstPerson && i === v.bio!.length - 1 ? "”" : ""}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
