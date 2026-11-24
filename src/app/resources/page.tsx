import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { dailyOffice, resources } from "@/content/site";

export const metadata: Metadata = { title: "Resources" };

export default function Resources() {
  return (
    <>
      <PageHero eyebrow="Connect" title="Resources" />
      <section className="mx-auto max-w-6xl space-y-16 px-6 py-20">
        {/* The Daily Office: the parish's liturgical calendar (Fr. Dave). Links always open today's office. */}
        <div id="daily-office" className="scroll-mt-40">
          <h2 className="text-3xl">The Daily Office</h2>
          <p className="mt-2 text-ink-soft">
            From{" "}
            <a href={dailyOffice.site} target="_blank" rel="noopener" className="text-oxblood underline underline-offset-2">
              dailyoffice2019.com
            </a>
            , following the 2019 Book of Common Prayer.
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dailyOffice.offices.map((o) => (
              <li key={o.href}>
                <a
                  href={o.href}
                  target="_blank"
                  rel="noopener"
                  className="group block h-full border-t-2 border-gold paper p-5 transition-shadow hover:shadow-lg hover:shadow-ink/10"
                >
                  <span className="eyebrow block text-sm">Today&apos;s</span>
                  <span className="mt-1 block font-display text-2xl group-hover:text-oxblood">{o.label} ↗</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2" data-no-reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-2xl">Liturgical Calendar</h3>
                <a href={dailyOffice.calendar} target="_blank" rel="noopener" className="text-sm font-semibold text-oxblood hover:underline">
                  Open full calendar ↗
                </a>
              </div>
              <iframe
                src={dailyOffice.calendar}
                title="Liturgical calendar from The Daily Office (dailyoffice2019.com)"
                loading="lazy"
                className="mt-4 h-[720px] w-full border border-gold/30 bg-white"
              />
            </div>
            <div className="paper-deep p-6">
              <h3 className="text-2xl">Listen daily</h3>
              <p className="mt-2 text-ink-soft">The Daily Office Podcast: Morning and Evening Prayer, every day.</p>
              <ul className="mt-4 space-y-2">
                {dailyOffice.podcast.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} target="_blank" rel="noopener" className="font-semibold text-oxblood hover:underline">
                      {p.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

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
                      {l.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={l.image}
                          alt=""
                          loading="lazy"
                          className={l.fit === "cover" ? "h-full w-full object-cover" : "max-h-32 max-w-[70%] object-contain"}
                        />
                      ) : (
                        <span className="px-6 text-center font-smallcaps text-2xl text-ink">{l.label}</span>
                      )}
                    </div>
                    <p className="p-5 font-display text-2xl group-hover:text-oxblood">{l.label} ↗</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
