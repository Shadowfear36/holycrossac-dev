import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Needed from "@/components/Needed";
import PageHero from "@/components/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Contact Us" };

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Contact Us" />

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-5">
        <div className="md:col-span-2">
          <dl className="space-y-6 text-ink-soft">
            <div>
              <dt className="eyebrow">Church</dt>
              <dd className="mt-1">
                <a href={site.address.mapUrl} className="hover:text-oxblood">
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Correspondence can be mailed to</dt>
              <dd className="mt-1">
                {site.mailing.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Phone</dt>
              <dd className="mt-1"><a href={`tel:${site.phone}`} className="hover:text-oxblood">{site.phone}</a></dd>
            </div>
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">
                {site.email ? (
                  <a href={`mailto:${site.email}`} className="hover:text-oxblood">{site.email}</a>
                ) : (
                  <Needed>The parish email address (the old site shows a broken one).</Needed>
                )}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Follow</dt>
              <dd className="mt-1 flex gap-4">
                <a href={site.social.facebook} className="hover:text-oxblood">Facebook</a>
                <a href={site.social.youtube} className="hover:text-oxblood">YouTube</a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-gold/30 p-8 md:col-span-3">
          <h2 className="text-3xl">Send Us a Message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
