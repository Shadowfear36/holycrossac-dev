import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import PageHero from "@/components/PageHero";
import { getGallery } from "@/lib/gallery";

export const metadata: Metadata = { title: "Parish Life" };

export default function ParishLife() {
  const photos = getGallery();
  return (
    <>
      <PageHero eyebrow="Connect" title="Parish Life" />
      <section className="mx-auto max-w-6xl px-6 py-20" data-no-reveal>
        <Gallery photos={photos} />
      </section>
    </>
  );
}
