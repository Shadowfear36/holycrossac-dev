import Link from "next/link";
import { nav, services, site } from "@/content/site";
import CrossMark from "./CrossMark";

export default function Footer() {
  return (
    <footer className="bg-ink text-parchment/80">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <CrossMark className="h-10 w-10 text-gold" />
            <span className="font-display text-2xl text-parchment">Holy Cross</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            An Anglo-Catholic parish of the{" "}
            <a href={site.diocese.url} className="underline decoration-gold/50 underline-offset-2 hover:text-gold-light">
              {site.diocese.name}
            </a>{" "}
            and the{" "}
            <a href={site.province.url} className="underline decoration-gold/50 underline-offset-2 hover:text-gold-light">
              {site.province.name}
            </a>
            .
          </p>
        </div>

        <div>
          <h3 className="eyebrow mb-4 text-gold-light">Visit</h3>
          <address className="text-sm not-italic leading-relaxed">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
            <br />
            <a href={site.address.mapUrl} className="mt-2 inline-block text-gold-light hover:underline">
              Get directions →
            </a>
          </address>
          <p className="mt-4 text-sm">
            {site.mailing.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </p>
        </div>

        <div>
          <h3 className="eyebrow mb-4 text-gold-light">Worship</h3>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.day + s.time}>
                <span className="text-parchment">{s.day} {s.time}</span>
                <br />
                {s.name}
              </li>
            ))}
          </ul>
          <a href={site.social.livestream} className="mt-4 inline-block text-sm text-gold-light hover:underline">
            Our services are live streamed →
          </a>
        </div>

        <div>
          <h3 className="eyebrow mb-4 text-gold-light">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li><a href={`tel:${site.phone}`} className="hover:text-gold-light">{site.phone}</a></li>
            {site.email && (
              <li><a href={`mailto:${site.email}`} className="hover:text-gold-light">{site.email}</a></li>
            )}
            <li><a href={site.social.facebook} className="hover:text-gold-light">Facebook</a></li>
            <li><a href={site.social.youtube} className="hover:text-gold-light">YouTube</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-parchment/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs md:flex-row">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-gold-light">{n.label}</Link>
            ))}
            <Link href="/give/" className="hover:text-gold-light">Give</Link>
          </nav>
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
