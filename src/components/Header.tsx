"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/content/site";
import CrossMark from "./CrossMark";

export default function Header() {
  const pathname = usePathname();
  // Menu is open only for the page it was opened on, so it closes on navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (fn: (o: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 paper backdrop-blur">
      {/* Utility bar */}
      <div className="hidden bg-oxblood-dark text-parchment/90 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-1.5 text-xs tracking-wide">
          <span>
            Sundays 9:30 a.m. · {site.address.street}, {site.address.city}
          </span>
          <div className="flex items-center gap-5">
            <a href={site.social.livestream} target="_blank" rel="noreferrer" className="hover:text-gold-light">
              Watch Live
            </a>
            <a href={site.social.facebook} target="_blank" rel="noreferrer" className="hover:text-gold-light">
              Facebook
            </a>
            <a href={site.social.youtube} target="_blank" rel="noreferrer" className="hover:text-gold-light">
              YouTube
            </a>
            <a href={`tel:${site.phone}`} className="hover:text-gold-light">
              {site.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <CrossMark className="h-10 w-10 transition-transform duration-300 group-hover:rotate-[8deg] group-hover:scale-105" />
          <span className="leading-tight">
            <span className="block font-display text-2xl text-ink">Holy Cross</span>
            <span className="block text-[0.65rem] uppercase tracking-[0.25em] text-stone">
              Anglican Church · Sanger
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-ink-soft transition-colors hover:text-oxblood"
              >
                {item.label}
                {item.children && (
                  <svg viewBox="0 0 10 6" className="h-1.5 w-2.5 opacity-60" aria-hidden>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full min-w-60 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="border border-gold/20 paper py-2 shadow-xl shadow-ink/10">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="block px-5 py-2.5 text-sm text-ink-soft hover:bg-parchment-deep hover:text-oxblood"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          <Link
            href="/give/"
            className="ml-3 bg-oxblood px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-parchment transition-colors hover:bg-oxblood-dark"
          >
            Give
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex h-11 w-11 items-center justify-center lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-ink" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-gold/20 paper px-6 pb-6 lg:hidden" aria-label="Mobile">
          {nav.map((item) => (
            <div key={item.label} className="border-b border-gold/15 py-3">
              <Link href={item.href} className="block py-1 font-display text-xl text-ink">
                {item.label}
              </Link>
              {item.children?.map((c) => (
                <Link key={c.href} href={c.href} className="block py-1.5 pl-3 text-ink-soft">
                  {c.label}
                </Link>
              ))}
            </div>
          ))}
          <Link
            href="/give/"
            className="mt-5 block bg-oxblood py-3 text-center font-semibold uppercase tracking-wider text-parchment"
          >
            Give
          </Link>
        </nav>
      )}
    </header>
  );
}
