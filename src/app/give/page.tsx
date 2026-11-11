import type { Metadata } from "next";
import Needed from "@/components/Needed";
import PageHero from "@/components/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Give" };

export default function Give() {
  return (
    <>
      <PageHero eyebrow="Give" title="Give" />
      <section className="mx-auto max-w-4xl px-6 py-20">
        {site.givingUrl ? (
          <a href={site.givingUrl} className="inline-block bg-oxblood px-8 py-4 text-sm font-semibold uppercase tracking-wider text-parchment hover:bg-oxblood-dark">
            Give online
          </a>
        ) : (
          <Needed>
            How the parish would like to receive gifts: an online giving link (if any), who
            checks should be made payable to, and whether to mail them to P.O. Box 425. Also
            any wording or scripture Fr. Dave would like on this page.
          </Needed>
        )}
      </section>
    </>
  );
}
