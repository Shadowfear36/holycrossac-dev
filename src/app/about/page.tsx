import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import { site } from "@/content/site";
import { aboutIntro, believing, fisherQuote, sacramental, spiritService, worshiping } from "@/content/about";

export const metadata: Metadata = { title: "About Us" };

export default function About() {
  const sections = [believing, worshiping, spiritService, sacramental];

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={aboutIntro.heading}
        photo="hero-about"
        photoHint="Church interior"
        // Title sits low; the crop keeps the clergy's faces in the open space above it at every width
        titleLow
        photoClassName="object-[50%_60%]"
        caption="Holy Cross and Emmanuel clergy"
      />

      <section className="mx-auto grid max-w-6xl items-start gap-14 px-6 py-20 md:grid-cols-5">
        <div className="prose-church drop-cap text-lg md:col-span-3">
          {aboutIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <figure className="md:col-span-2">
          <Photo
            name="about-church"
            alt="Fr. Dave and Dcn. (ret.) Melinda lighting the Paschal Candle"
            hint="Parish photo"
            className="aspect-[4/5] w-full"
          />
          <figcaption className="mt-3 text-center font-display text-base italic text-stone">
            Fr. Dave &amp; Dcn. (ret.) Melinda lighting the Paschal Candle
          </figcaption>
        </figure>
      </section>

      {sections.map((s, i) => (
        <section key={s.id} id={s.id} className={i % 2 === 0 ? "paper-deep" : ""}>
          <div className="mx-auto max-w-4xl px-6 py-20">
            <div className="ornament mx-auto mb-6 max-w-xs">✠</div>
            <h2 className="text-center text-4xl md:text-5xl">{s.heading}</h2>
            <div className="prose-church drop-cap mt-8 text-lg">
              {s.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
            {s.id === "beliefs" && (
              <blockquote className="mt-10 border-y border-gold/40 py-8">
                <p className="scripture illuminated text-2xl md:text-3xl">{fisherQuote.text}</p>
                <footer className="scripture-cite mt-5 text-right text-stone">{fisherQuote.attribution}</footer>
              </blockquote>
            )}
          </div>
        </section>
      ))}

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-2">
        {[site.diocese, site.province].map((org) => (
          <a
            key={org.url}
            href={org.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-6 border border-gold/30 p-8 transition-colors hover:border-oxblood"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.logo} alt="" className="h-20 w-auto max-w-32 shrink-0 object-contain" loading="lazy" />
            <div>
              <h3 className="text-3xl group-hover:text-oxblood">{org.name}</h3>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-oxblood">Visit website →</p>
            </div>
          </a>
        ))}
      </section>
    </>
  );
}
