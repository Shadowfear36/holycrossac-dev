import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import ServiceCard from "@/components/ServiceCard";
import { site } from "@/content/site";
import { worshiping } from "@/content/about";

export const metadata: Metadata = { title: "Worship" };

export default function Worship() {
  return (
    <>
      <PageHero eyebrow="Worship" title="Please join us for Sunday worship!" photo="hero-worship" photoHint="Sunday worship" />

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-5">
        <div className="md:col-span-3">
          <h2 className="text-4xl">{worshiping.heading}</h2>
          <div className="prose-church drop-cap mt-6 text-lg">
            {worshiping.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link href="/about/#sacraments" className="font-semibold text-oxblood hover:underline">
            We are a Sacramental Church →
          </Link>
        </div>
        <div className="md:col-span-2">
          <ServiceCard />
        </div>
      </section>

      <section id="livestream" className="bg-ink text-parchment">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="eyebrow text-gold-light">Watch online</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Our services are live streamed.</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.social.livestream} className="bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-gold-light">
                Our Worship Services
              </a>
              <a href={site.social.youtube} className="border border-parchment/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-parchment hover:text-ink">
                Visit us on YouTube
              </a>
            </div>
          </div>
          <Photo name="worship-livestream" alt="" hint="Sunday worship" className="aspect-video w-full" />
        </div>
      </section>
    </>
  );
}
