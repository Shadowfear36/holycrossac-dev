import type { Metadata } from "next";
import Link from "next/link";
import Needed from "@/components/Needed";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import { worshiping } from "@/content/about";

export const metadata: Metadata = { title: "I'm New Here" };

export default function NewHere() {
  return (
    <>
      <PageHero eyebrow="Welcome" title="I'm New Here" photo="hero-new-here" photoHint="Front doors / exterior of the church" photoPosition="60% 40%" />

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-5">
        <div className="md:col-span-3">
          <h2 className="text-4xl">Please join us for Sunday worship!</h2>
          <div className="prose-church drop-cap mt-6 text-lg">
            <p>{worshiping.paragraphs[0]}</p>
          </div>
          <Needed className="mt-8">
            A short &ldquo;what to expect&rdquo; guide for first-time visitors, written or approved by Fr. Dave.
            For example: when to arrive, parking, who may receive Communion, children, what to
            wear, and anything after the service.
          </Needed>
        </div>
        <aside className="space-y-8 md:col-span-2">
          <ServiceCard />
          <div className="paper-deep p-7">
            <h2 className="text-2xl">Have a question?</h2>
            <Link href="/contact/" className="mt-3 inline-block font-semibold text-oxblood hover:underline">
              Contact us →
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
