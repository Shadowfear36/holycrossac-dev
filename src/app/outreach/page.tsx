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
              {/* Video, or the photo (appears automatically once public/photos/<m.photo>.jpg is added) */}
              {m.video ? (
                <div className={`aspect-video w-full overflow-hidden bg-ink md:col-span-2 ${i % 2 ? "md:order-2" : ""}`}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${m.video.youtubeId}?rel=0`}
                    title={m.video.title}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <Photo
                  name={m.photo}
                  alt={m.name}
                  hint={m.name}
                  className={`aspect-[4/3] w-full md:col-span-2 ${i % 2 ? "md:order-2" : ""}`}
                />
              )}
              <div className="md:col-span-3">
                <div className="ornament max-w-[8rem] justify-start text-gold [&::before]:hidden">✠</div>
                <h2 className="mt-2 text-4xl">{m.name}</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-soft">{m.description}</p>
                {m.link && (
                  <a
                    href={m.link.href}
                    target="_blank"
                    rel="noopener"
                    className="mt-4 inline-block font-semibold text-oxblood underline decoration-gold/50 underline-offset-4 hover:decoration-oxblood"
                  >
                    {m.link.label} ↗
                  </a>
                )}
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
