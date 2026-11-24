import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import { site } from "@/content/site";
import { aboutIntro, believing, sacramental, spiritService, worshiping } from "@/content/about";

export const metadata: Metadata = { title: "About Us" };

export default function About() {
  const sections = [believing, worshiping, spiritService, sacramental];

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={aboutIntro.heading}
        photo="hero-about"
        photoHint="Holy Cross members"
        // Group photo: shown on its own across the top, title below, so no one is covered
        stacked
        photoPosition="50% 55%"
        caption="Holy Cross members"
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
          </div>
        </section>
      ))}

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-3">
        {[site.diocese, site.province, site.communion].map((org) => (
          <a
            key={org.url}
            href={org.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${org.name} (opens their website)`}
            className="group flex flex-col items-center justify-center gap-5 border border-gold/30 p-8 transition-colors hover:border-oxblood"
          >
            {/* Official logos only, for consistency (Fr. Dave, Nov 2026) */}
            {org.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={org.logo} alt={org.name} className="h-16 w-auto max-w-full object-contain md:h-20" loading="lazy" />
            ) : (
              <p className="flex h-16 items-center text-center font-smallcaps text-3xl leading-tight text-ink md:h-20">{org.name}</p>
            )}
            <p className="text-sm font-semibold uppercase tracking-wider text-oxblood">Visit website →</p>
          </a>
        ))}
      </section>
    </>
  );
}
