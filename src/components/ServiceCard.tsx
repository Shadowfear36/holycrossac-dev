import { services, site } from "@/content/site";

/** Service-times card, used on the home and worship pages. */
export default function ServiceCard({ className = "" }: { className?: string }) {
  return (
    <div className={`border border-gold/30 paper p-8 shadow-xl shadow-ink/5 ${className}`}>
      <p className="eyebrow">Join us for worship</p>
      <ul className="mt-4 divide-y divide-gold/20">
        {services.map((s) => (
          <li key={s.day + s.time} className="py-4 first:pt-0 last:pb-0">
            <p className="font-display text-3xl text-oxblood">
              {s.day} · {s.time}
            </p>
            <p className="mt-1 font-semibold text-ink">{s.name}</p>
            {s.note && <p className="text-sm text-stone">{s.note}</p>}
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-gold/20 pt-5 text-sm text-ink-soft">
        <p>
          {site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={site.address.mapUrl}
            className="bg-oxblood px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-parchment hover:bg-oxblood-dark"
          >
            Directions
          </a>
          <a
            href={site.social.livestream}
            className="border border-oxblood px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-oxblood hover:bg-oxblood hover:text-parchment"
          >
            Watch Live
          </a>
        </div>
      </div>
    </div>
  );
}
