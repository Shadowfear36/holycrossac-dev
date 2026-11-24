import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { dailyOffice, services } from "@/content/site";
import MonthCalendar from "@/components/MonthCalendar";
import { EventsList } from "@/components/UpcomingEvents";

export const metadata: Metadata = { title: "Calendar of Events" };

export default function Events() {
  return (
    <>
      <PageHero eyebrow="Connect" title="Calendar of Events" />

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="eyebrow">Coming Up</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Upcoming Events</h2>
          <div className="mt-6">
            <EventsList />
          </div>
        </div>

        <aside className="h-fit paper-deep p-7">
          <p className="eyebrow">Every week</p>
          <ul className="mt-4 space-y-4">
            {services.map((s) => (
              <li key={s.day + s.time}>
                <p className="font-display text-2xl text-oxblood">
                  {s.day}s {s.time}
                </p>
                <p className="text-ink-soft">{s.name}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Month view of the parish Google Calendar (updates by itself; see CALENDAR.md) */}
      <section id="month" className="mx-auto max-w-6xl px-6 pb-24" data-no-reveal>
        <p className="eyebrow">Month by Month</p>
        <h2 className="mt-3 mb-8 text-3xl md:text-4xl">Parish Calendar</h2>
        <MonthCalendar />
      </section>

      {/* The liturgical year (seasons, holy days and their colours) from The Daily Office: Fr. Dave, Nov 2026 */}
      <section id="liturgical-calendar" className="paper-deep">
        <div className="mx-auto max-w-6xl px-6 py-20" data-no-reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">The Church Year</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Liturgical Calendar</h2>
              <p className="mt-2 text-ink-soft">
                Seasons and holy days, with their liturgical colors, from{" "}
                <a href={dailyOffice.site} target="_blank" rel="noopener" className="text-oxblood underline underline-offset-2">
                  The Daily Office
                </a>
                .
              </p>
            </div>
            <a href={dailyOffice.calendar} target="_blank" rel="noopener" className="font-semibold text-oxblood hover:underline">
              Open full calendar ↗
            </a>
          </div>
          <iframe
            src={dailyOffice.calendar}
            title="Liturgical calendar from The Daily Office (dailyoffice2019.com)"
            loading="lazy"
            className="mt-8 h-[820px] w-full border border-gold/30 bg-white"
          />
        </div>
      </section>
    </>
  );
}
