import type { Metadata } from "next";
import Link from "next/link";
import CrossMark from "@/components/CrossMark";
import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import { alms, givingIntro, lastingGifts, roadmap, tithes, waysToGive } from "@/content/giving";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "A Culture of Generosity" };

export default function Give() {
  return (
    <>
      <PageHero eyebrow="Give" title="A Culture of Generosity" />

      <section className="mx-auto max-w-4xl px-6 pt-20">
        <p className="font-display text-2xl italic leading-relaxed text-ink-soft md:text-3xl">{givingIntro}</p>
      </section>

      {/* Fr. Dave (Nov 2026): the giving link right at the top; the teaching follows; then the ways to give again.
          The QR code is at the bottom, beside Planned Giving. */}
      {site.givingUrl && (
        <section className="mt-14 bg-oxblood text-parchment">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 py-14 text-center md:flex-row md:justify-center md:text-left">
            {/* Photo: the nave of Holy Cross (public/photos/worship-interior.jpg) */}
            <Photo
              name="worship-interior"
              alt="Inside Holy Cross Anglican Church"
              hint="Inside the church"
              className="aspect-[4/3] w-full max-w-sm shrink-0 shadow-lg md:w-80"
            />
            <div>
              <p className="eyebrow text-gold-light">Give Online</p>
              <p className="mt-3 font-display text-3xl leading-snug md:text-4xl">Once or on a regular schedule, by card or bank.</p>
              <a
                href={site.givingUrl}
                className="mt-6 inline-block bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-wider text-ink hover:bg-gold-light"
              >
                Give online
              </a>
            </div>
          </div>
        </section>
      )}


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

      {/* Ways to give (each card is clickable where there's somewhere to go) */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow">Ways to Give</p>
        <h2 className="mt-3 text-4xl md:text-5xl">How to Give</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {site.givingUrl && (
            <li>
              <a
                href={site.givingUrl}
                className="group flex h-full flex-col border-t-2 border-gold paper p-6 transition-shadow hover:shadow-lg hover:shadow-ink/10"
              >
                <h3 className="text-2xl group-hover:text-oxblood">Online</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">Give securely online, once or on a regular schedule.</p>
                <span className="mt-auto pt-4 font-semibold text-oxblood">Give online →</span>
              </a>
            </li>
          )}
          {waysToGive.map((w) => {
            const body = (
              <>
                <h3 className={`text-2xl ${w.href ? "group-hover:text-oxblood" : ""}`}>{w.title}</h3>
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
                {w.href && <span className="mt-auto pt-4 font-semibold text-oxblood">{w.hrefLabel} →</span>}
              </>
            );
            return (
              <li key={w.title}>
                {w.href ? (
                  <a
                    href={w.href}
                    className="group flex h-full flex-col border-t-2 border-gold paper p-6 transition-shadow hover:shadow-lg hover:shadow-ink/10"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="flex h-full flex-col border-t-2 border-gold paper p-6">{body}</div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Other ways to give (lasting gifts) */}
        <div className="mt-20">
          <p className="eyebrow">Lasting Gifts</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Other Ways to Give</h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {lastingGifts.map((g) => (
              <div key={g.title} className="border-l-2 border-gold pl-6">
                <h3 className="text-2xl">{g.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{g.text}</p>
              </div>
            ))}
            {/* Scan to give: fills the space beside Planned Giving */}
            {site.givingUrl && (
              <div className="flex flex-col items-center gap-6 bg-oxblood p-8 text-center text-parchment sm:flex-row sm:text-left">
                <a href={site.givingUrl} aria-label="Give online" className="shrink-0 bg-white p-2 shadow-lg">
                  {/* QR (scripts/make-giving-qr.mjs) opens the quick-giving page, holycrossac.org/give-now/ */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/giving-qr.svg" alt="QR code for giving to Holy Cross" width={144} height={144} className="h-36 w-36" />
                </a>
                <div>
                  <p className="eyebrow text-gold-light">Give Online</p>
                  <p className="mt-2 font-display text-2xl leading-snug">Scan the code with your phone’s camera.</p>
                  <a
                    href={site.givingUrl}
                    className="mt-4 inline-block bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink hover:bg-gold-light"
                  >
                    Give online
                  </a>
                </div>
              </div>
            )}
          </div>
          <p className="mt-12 text-lg">
            To talk about a gift like this, please{" "}
            <Link href="/contact/" className="font-semibold text-oxblood hover:underline">
              contact Fr. Dave
            </Link>
            .
          </p>
        </div>
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
