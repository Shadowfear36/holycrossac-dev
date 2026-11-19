import Link from "next/link";
import CrossMark from "@/components/CrossMark";
import FacebookFeed from "@/components/FacebookFeed";
import Gallery from "@/components/Gallery";
import { getGallery } from "@/lib/gallery";
import LiveBanner from "@/components/LiveBanner";
import Photo from "@/components/Photo";
import { UpcomingEventsSection } from "@/components/UpcomingEvents";
import ServiceCard from "@/components/ServiceCard";
import { outreach, site } from "@/content/site";
import { featuredQuote, homeIntro } from "@/content/about";

// Mirrors the three columns on the old home page: Who We Are, Our Worship Services, Resources
const tiles = [
  { title: "Who We Are", href: "/about/", photo: "tile-about", hint: "Holy Cross members" },
  { title: "Our Worship Services", href: "/worship/", photo: "tile-worship", hint: "Sunday worship", position: "50% 40%" },
  { title: "Resources", href: "/resources/", photo: "tile-resources", hint: "Prayer book / altar" },
];

export default function Home() {

  return (
    <>
      {/* Hero */}
      <section className="hero relative isolate overflow-hidden bg-ink lg:min-h-[600px]">
        {/* The church on O Street (photo requested by Fr. Dave).
            Phones/tablets: photo across the top, lettering below. Desktop: photo on the right,
            fading into the dark panel that holds the lettering. */}
        <Photo
          name="hero-church"
          alt="Holy Cross Anglican Church, 828 O Street, Sanger"
          priority
          position="50% 55%"
          // Desktop: the photo's own left edge fades to transparent, so it melts into the dark panel (no seam)
          className="absolute inset-x-0 top-0 -z-20 h-[300px] w-full sm:h-[380px] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[70%] lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_22%,black_48%)]"
        />
        {/* Phones/tablets: photo fades down into the dark panel under it */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-gradient-to-b from-ink/10 via-ink/25 to-ink sm:h-[380px] lg:hidden" />
        {/* Desktop: bottom of the photo settles softly into the dark band */}
        <div className="absolute inset-0 -z-10 hidden bg-gradient-to-t from-ink from-0% via-ink/0 via-30% lg:block" />
        <div className="mx-auto flex max-w-6xl flex-col justify-start px-6 pb-16 pt-[250px] sm:pt-[330px] lg:min-h-[600px] lg:justify-center lg:py-24">
          <p className="eyebrow text-gold-light">Welcome to</p>
          <h1 className="mt-3 max-w-3xl text-6xl text-parchment md:text-8xl">
            Holy Cross
            <span className="block text-4xl italic text-parchment/85 md:text-5xl">
              Anglican Church
            </span>
          </h1>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/worship/"
              className="bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-gold-light"
            >
              Sunday Worship
            </Link>
            <a
              href={site.social.livestream}
              className="border border-parchment/60 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-parchment transition-colors hover:bg-parchment hover:text-ink"
            >
              Watch Online
            </a>
          </div>
        </div>
      </section>

      {/* Vision & Mission (Fr. Dave, Nov 2026: feature prominently) */}
      <section className="border-b border-gold/40 paper-deep">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:gap-0">
          {[
            { label: "Our Vision", text: site.vision },
            { label: "Our Mission", text: site.mission },
          ].map((v, i) => (
            <div key={v.label} className={`text-center md:px-12 ${i ? "md:border-l md:border-gold/40" : ""}`}>
              <CrossMark className="mx-auto h-9 w-9" />
              <p className="eyebrow mt-5">{v.label}</p>
              <p className={`mt-4 font-display italic leading-snug text-ink ${i ? "text-2xl md:text-[1.7rem]" : "text-3xl md:text-4xl"}`}>
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome + service times */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-5">
        <div className="md:col-span-3">
          <p className="eyebrow">Welcome</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Welcome to Holy Cross Anglican Church</h2>
          <div className="prose-church drop-cap mt-6 text-lg">
            {homeIntro.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <Link href="/about/" className="mt-2 inline-block font-semibold text-oxblood hover:underline">
            About us →
          </Link>
        </div>
        <div className="md:col-span-2">
          <ServiceCard />
        </div>
      </section>

      {/* Featured scripture (chosen by Fr. Dave) */}
      <section className="bg-oxblood text-parchment">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="ornament mx-auto max-w-xs text-gold-light">✠</div>
          <blockquote className="scripture illuminated illuminated-gold mt-10 text-left text-3xl md:text-4xl">
            {featuredQuote.text}
          </blockquote>
          <p className="scripture-cite mt-8 text-lg text-gold-light">{featuredQuote.attribution}</p>
          <div className="ornament mx-auto mt-8 max-w-xs text-gold-light">❦</div>
        </div>
      </section>

      {/* Online: livestream banner + latest Facebook posts (update themselves).
          YouTube player removed Nov 2026 (latest video is outdated); restore with <YouTubeLatest /> once the channel is current. */}
      <section className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-24 lg:grid-cols-2">
        <div className="lg:sticky lg:top-40">
          <p className="eyebrow">Online</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Holy Cross Online</h2>
          <p className="mt-4 text-lg text-ink-soft">Our services are live streamed.</p>
          <div className="mt-8">
            <LiveBanner tone="light" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-[#1877F2] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#166fe0]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
                <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
              </svg>
              Follow on Facebook
            </a>
          </div>
        </div>
        <div data-no-reveal>
          <h3 className="mb-3 text-2xl">Latest on Facebook</h3>
          <FacebookFeed height={720} />
        </div>
      </section>

      {/* Tiles */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {tiles.map((t) => (
            <Link key={t.href} href={t.href} className="group block paper-deep">
              <div className="overflow-hidden">
                <Photo
                  name={t.photo}
                  alt=""
                  hint={t.hint}
                  position={"position" in t ? t.position : undefined}
                  className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <h3 className="text-3xl group-hover:text-oxblood">{t.title}</h3>
                <span className="mt-3 inline-block text-sm font-semibold uppercase tracking-wider text-oxblood">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Outreach ministries (descriptions from Fr. Dave) */}
      <section className="paper-deep">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Outreach</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Our Outreach Ministries</h2>
            </div>
            <Link href="/outreach/" className="font-semibold text-oxblood hover:underline">
              All outreach ministries →
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outreach.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/outreach/#${m.id}`}
                  className="group block h-full overflow-hidden border-t-2 border-gold paper transition-shadow hover:shadow-lg hover:shadow-ink/10"
                >
                  <div className="relative overflow-hidden">
                    {m.video ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://i.ytimg.com/vi/${m.video.youtubeId}/hqdefault.jpg`}
                          alt=""
                          loading="lazy"
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-oxblood/90 text-parchment shadow-lg">
                            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" aria-hidden>
                              <path fill="currentColor" d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </span>
                      </>
                    ) : (
                      <Photo
                        name={m.photo}
                        alt=""
                        hint={m.name}
                        className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl group-hover:text-oxblood">{m.name}</h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">{m.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Parish Life: a few photos from the gallery */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Parish Life</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Life at Holy Cross</h2>
          </div>
          <Link href="/parish-life/" className="font-semibold text-oxblood hover:underline">
            See all photos →
          </Link>
        </div>
        <div className="mt-10" data-no-reveal>
          <Gallery photos={getGallery().slice(0, 6)} layout="grid" />
        </div>
      </section>

      {/* Upcoming events (past ones hide themselves) */}
      <UpcomingEventsSection />

      {/* Visit / map */}
      <section className="grid md:grid-cols-2">
        <iframe
          title="Map to Holy Cross Anglican Church"
          src={site.address.mapEmbed}
          className="h-80 w-full border-0 grayscale md:h-full md:min-h-96"
          loading="lazy"
        />
        <div className="bg-ink px-6 py-16 text-parchment md:px-14">
          <p className="eyebrow text-gold-light">Visit us</p>
          <h2 className="mt-3 text-4xl">Please join us for Sunday worship!</h2>
          <address className="mt-6 not-italic leading-relaxed text-parchment/85">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </address>
          <p className="mt-4 text-parchment/85">
            <a href={`tel:${site.phone}`} className="hover:text-gold-light">{site.phone}</a>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact/" className="bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-gold-light">
              Contact Us
            </Link>
            <a href={site.address.mapUrl} className="border border-parchment/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-parchment hover:text-ink">
              Directions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
