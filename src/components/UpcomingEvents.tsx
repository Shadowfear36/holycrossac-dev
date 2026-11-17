"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { events, site } from "@/content/site";
import { formatDate } from "@/lib/dates";

/**
 * Parish events from site.ts, hiding any whose date has passed (by today's date in
 * Pacific time, checked in the visitor's browser), so the list never goes stale.
 * Before the browser's clock is known (the prebuilt page), all listed events show.
 */
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};
const todayPacific = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: site.livestreamSchedule.timeZone }).format(new Date()); // yyyy-mm-dd
const serverToday = () => null;

function useUpcoming(limit?: number) {
  const today = useSyncExternalStore(subscribe, todayPacific, serverToday);
  const list = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((e) => today === null || e.date >= today);
  return limit ? list.slice(0, limit) : list;
}

/** Full list, for the Calendar of Events page. */
export function EventsList() {
  const list = useUpcoming();
  if (!list.length) {
    return <p className="text-lg text-ink-soft">No upcoming events are listed right now.</p>;
  }
  return (
    <ul className="divide-y divide-gold/25">
      {list.map((e) => {
        const d = formatDate(e.date);
        return (
          <li key={e.date + e.title} className="flex gap-6 py-6">
            <div className="w-16 shrink-0 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone">{d.month}</p>
              <p className="font-display text-5xl leading-none text-oxblood">{d.day}</p>
            </div>
            <div>
              <h3 className="text-2xl">{e.title}</h3>
              <p className="mt-1 text-sm text-stone">
                {d.long}
                {e.time ? ` · ${e.time}` : ""}
              </p>
              {e.description && <p className="mt-2 text-ink-soft">{e.description}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** "Upcoming Events" section for the home page (next three; hidden if none). */
export function UpcomingEventsSection() {
  const list = useUpcoming(3);
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-24">
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
        {list.map((e) => {
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
  );
}
