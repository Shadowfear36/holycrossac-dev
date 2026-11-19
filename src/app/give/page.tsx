import type { Metadata } from "next";
import CrossMark from "@/components/CrossMark";
import PageHero from "@/components/PageHero";
import { alms, givingIntro, roadmap, tithes, waysToGive } from "@/content/giving";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "A Culture of Generosity" };

export default function Give() {
  return (
    <>
      <PageHero eyebrow="Give" title="A Culture of Generosity" />

      <section className="mx-auto max-w-4xl px-6 pt-20">
        <p className="font-display text-2xl italic leading-relaxed text-ink-soft md:text-3xl">{givingIntro}</p>
        <div className="mt-10">
          {site.givingUrl ? (
            <a
              href={site.givingUrl}
              className="inline-block bg-oxblood px-8 py-4 text-sm font-semibold uppercase tracking-wider text-parchment hover:bg-oxblood-dark"
            >
              Give online
            </a>
          ) : (
            // Fr. Dave (Nov 2026): "work in progress" until online giving is set up (then a QR code too)
            <p className="border-l-2 border-gold pl-5 text-lg text-ink-soft">
              Online giving is a work in progress. Please check back soon.
            </p>
          )}
        </div>
      </section>

      {/* Tithes & alms */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="eyebrow">The Tithe</p>
          <h2 className="mt-3 text-4xl">{tithes.heading}</h2>
          <blockquote className="scripture mt-6 border-l-2 border-gold pl-5 text-xl">
            “{tithes.canon.text}”
            <footer className="scripture-cite mt-3 text-base text-stone">{tithes.canon.cite}</footer>
          </blockquote>
          <div className="prose-church mt-6 text-lg">
            {tithes.paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">For the Poor</p>
          <h2 className="mt-3 text-4xl">{alms.heading}</h2>
          <div className="prose-church mt-6 text-lg">
            {alms.paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Generosity Roadmap */}
      <section className="paper-deep">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <p className="eyebrow text-center">Growing in Giving</p>
          <h2 className="mt-3 text-center text-4xl md:text-5xl">Where are you on the Generosity Roadmap?</h2>

          <div className="mt-14">
            <p className="mx-auto w-fit border border-gold/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-oxblood">
              Start
            </p>
            <ol className="relative mx-auto mt-2 max-w-3xl">
              {/* the road: a dashed gold line down the middle (left edge on phones) */}
              <span
                aria-hidden
                className="absolute bottom-0 left-6 top-0 w-0 border-l-2 border-dashed border-gold/70 md:left-1/2 md:-translate-x-px"
              />
              {roadmap.map((stop, i) => {
                const right = i % 2 === 1;
                return (
                  <li key={stop.title} className="relative grid grid-cols-[3rem_1fr] items-center gap-5 py-6 md:grid-cols-[1fr_3.5rem_1fr] md:gap-8">
                    <div className={`hidden md:block ${right ? "" : "text-right"}`}>
                      {!right && <Stop title={stop.title} text={stop.text} n={i + 1} />}
                    </div>
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold bg-parchment shadow-md md:h-14 md:w-14">
                      <CrossMark className="h-7 w-7 md:h-8 md:w-8" />
                    </div>
                    <div className="md:hidden">
                      <Stop title={stop.title} text={stop.text} n={i + 1} />
                    </div>
                    <div className="hidden md:block">{right && <Stop title={stop.title} text={stop.text} n={i + 1} />}</div>
                  </li>
                );
              })}
            </ol>
            <p className="mx-auto mt-2 w-fit bg-oxblood px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-parchment">
              Finish
            </p>
          </div>
        </div>
      </section>

      {/* Ways to give */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow">Ways to Give</p>
        <h2 className="mt-3 text-4xl md:text-5xl">How to Give</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {waysToGive.map((w) => (
            <li key={w.title} className="border-t-2 border-gold paper p-6">
              <h3 className="text-2xl">{w.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{w.text}</p>
              {w.showMailing && (
                <address className="mt-4 font-display text-lg not-italic leading-snug">
                  {site.mailing.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              )}
            </li>
          ))}
          <li className="border-t-2 border-gold paper p-6">
            <h3 className="text-2xl">Online</h3>
            {site.givingUrl ? (
              <>
                <p className="mt-3 leading-relaxed text-ink-soft">Give securely online, once or on a regular schedule.</p>
                <a href={site.givingUrl} className="mt-4 inline-block font-semibold text-oxblood hover:underline">
                  Give online →
                </a>
              </>
            ) : (
              <p className="mt-3 leading-relaxed text-ink-soft">Online giving is a work in progress. Please check back soon.</p>
            )}
          </li>
        </ul>
        <p className="mt-12 text-sm text-stone">
          Adapted, with thanks, from{" "}
          <a
            href="https://www.emmanuelfresno.org/a-culture-of-generosity"
            target="_blank"
            rel="noopener"
            className="underline decoration-gold/50 underline-offset-2 hover:text-oxblood"
          >
            Emmanuel Anglican Church, Fresno
          </a>
          .
        </p>
      </section>
    </>
  );
}

function Stop({ title, text, n }: { title: string; text: string; n: number }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-stone">Step {n}</p>
      <h3 className="mt-1 text-2xl text-oxblood md:text-3xl">{title}</h3>
      <p className="mt-1 leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
