import Link from "next/link";
import Photo from "@/components/Photo";
import ServiceCard from "@/components/ServiceCard";
import { events, outreach, site } from "@/content/site";
import { aboutIntro, featuredQuote } from "@/content/about";
import { formatDate } from "@/lib/dates";

// Mirrors the three columns on the old home page: Who We Are, Our Worship Services, Resources
const tiles = [
  { title: "Who We Are", href: "/about/", photo: "tile-about", hint: "Church interior or exterior" },
  { title: "Our Worship Services", href: "/worship/", photo: "tile-worship", hint: "Sunday worship", position: "50% 40%" },
  { title: "Resources", href: "/resources/", photo: "tile-resources", hint: "Prayer book / altar" },
];

export default function Home() {
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

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
          <p className="mt-6 max-w-xl font-display text-2xl italic leading-relaxed text-parchment/90">
            {site.vision}
          </p>
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

      {/* Welcome + service times */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-5">
        <div className="md:col-span-3">
          <p className="eyebrow">Welcome</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Welcome to Holy Cross Anglican Church</h2>
          <div className="prose-church drop-cap mt-6 text-lg">
            <p>{site.mission}</p>
            <p>{aboutIntro.paragraphs[0]}</p>
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
                  <div className="overflow-hidden">
                    <Photo
                      name={m.photo}
                      alt=""
                      optional
                      className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105"
                    />
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

      {/* Upcoming (only shown once real events are added) */}
      {upcoming.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Calendar</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Upcoming Events</h2>
            </div>
            <Link href="/events/" className="font-semibold text-oxblood hover:underline">
              Full calendar →
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {upcoming.map((e) => {
              const d = formatDate(e.date);
              return (
                <li key={e.date + e.title} className="flex gap-5 border-t-2 border-gold pt-5">
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone">{d.month}</p>
                    <p className="font-display text-5xl leading-none text-oxblood">{d.day}</p>
                  </div>
                  <div>
                    <h3 className="text-2xl">{e.title}</h3>
                    <p className="mt-1 text-sm text-stone">
                      {d.weekday}
                      {e.time ? ` · ${e.time}` : ""}
                    </p>
                    {e.description && <p className="mt-2 text-sm text-ink-soft">{e.description}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

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
