"use client";

import { useState } from "react";
import { formatDate } from "@/lib/dates";
import { byTime, servicesOn, useOccurrences, useToday, type CalEvent } from "@/lib/parishCalendar";

/**
 * Month-at-a-glance calendar for the Calendar of Events page: every event from the parish Google
 * Calendar (and site.ts), plus the regular weekly services. Step through months with the arrows;
 * tap a day to see its events in full below the grid. Updates by itself (src/lib/parishCalendar.ts).
 */

const MONTHS_BACK = 1; // matches what the calendar feed provides (occurrencesFromIcs)
const MONTHS_AHEAD = 12;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

/** 570 → "9:30a", 1020 → "5p" */
function shortTime(min?: number) {
  if (min === undefined) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${((h + 11) % 12) + 1}${m ? `:${pad(m)}` : ""}${h < 12 ? "a" : "p"}`;
}

export default function MonthCalendar() {
  const today = useToday();
  const all = useOccurrences();
  const [offset, setOffset] = useState(0); // months from the current month
  const [picked, setPicked] = useState<string | null>(null);

  // Prerendered page (no clock yet): keep the space, fill in once the browser knows today's date
  if (!today) return <div className="min-h-[640px]" aria-hidden />;

  const [ty, tm] = today.split("-").map(Number);
  const first = new Date(Date.UTC(ty, tm - 1 + offset, 1));
  const y = first.getUTCFullYear();
  const m = first.getUTCMonth();
  const daysIn = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const lead = first.getUTCDay();
  const monthName = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" }).format(first);

  const byDay = new Map<string, CalEvent[]>();
  for (let d = 1; d <= daysIn; d++) {
    const date = iso(y, m, d);
    byDay.set(date, [...servicesOn((lead + d - 1) % 7, date), ...all.filter((e) => e.date === date)].sort(byTime));
  }

  const selected =
    picked && byDay.has(picked)
      ? picked
      : offset === 0
        ? today
        : ([...byDay.keys()].find((d) => byDay.get(d)!.some((e) => !e.regular)) ?? iso(y, m, 1));
  const selectedEvents = byDay.get(selected) ?? [];

  const go = (n: number) => {
    setOffset(n);
    setPicked(null);
  };

  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-3xl md:text-4xl" aria-live="polite">
          {monthName}
        </h3>
        <div className="flex items-center gap-2">
          {offset !== 0 && (
            <button type="button" onClick={() => go(0)} className="mr-2 text-sm font-semibold text-oxblood hover:underline">
              This month
            </button>
          )}
          <button
            type="button"
            onClick={() => go(offset - 1)}
            disabled={offset <= -MONTHS_BACK}
            aria-label="Previous month"
            className="h-11 w-11 border border-gold/50 text-2xl text-oxblood transition-colors hover:bg-oxblood hover:text-parchment disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-oxblood"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(offset + 1)}
            disabled={offset >= MONTHS_AHEAD}
            aria-label="Next month"
            className="h-11 w-11 border border-gold/50 text-2xl text-oxblood transition-colors hover:bg-oxblood hover:text-parchment disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-oxblood"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 border-l border-t border-gold/30">
        {DOW.map((d) => (
          <div key={d} className="border-b border-r border-gold/30 bg-oxblood py-2 text-center text-xs font-semibold uppercase tracking-wider text-parchment">
            <span className="md:hidden">{d[0]}</span>
            <span className="hidden md:inline">{d}</span>
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`x${i}`} className="border-b border-r border-gold/30 bg-ink/[0.03]" />;
          const date = iso(y, m, day);
          const list = byDay.get(date)!;
          const special = list.filter((e) => !e.regular);
          const isToday = date === today;
          const isPast = date < today;
          const isSel = date === selected;
          const label = `${formatDate(date).long}${list.length ? `: ${list.map((e) => e.title).join(", ")}` : ""}`;
          return (
            <button
              key={date}
              type="button"
              onClick={() => setPicked(date)}
              aria-label={label}
              aria-pressed={isSel}
              className={`relative flex min-h-16 flex-col items-stretch border-b border-r border-gold/30 p-1 text-left align-top transition-colors md:min-h-28 md:p-2 ${
                isSel ? "bg-gold/15 outline outline-2 -outline-offset-2 outline-oxblood" : "hover:bg-gold/10"
              } ${isPast ? "opacity-55" : ""}`}
            >
              <span
                className={`mx-auto flex h-7 w-7 items-center justify-center text-sm md:mx-0 ${
                  isToday ? "rounded-full bg-oxblood font-semibold text-parchment" : "text-ink"
                }`}
              >
                {day}
              </span>
              {/* phones: dots; larger screens: the events themselves */}
              {list.length > 0 && (
                <span className="mt-1 flex justify-center gap-1 md:hidden" aria-hidden>
                  {special.length > 0 && <span className="h-2 w-2 rounded-full bg-oxblood" />}
                  {list.length > special.length && <span className="h-2 w-2 rounded-full bg-stone/50" />}
                </span>
              )}
              <span className="mt-1 hidden space-y-1 md:block" aria-hidden>
                {list.slice(0, 3).map((e) => (
                  <span
                    key={e.title + e.minutes}
                    className={`block truncate px-1.5 py-0.5 text-xs leading-snug ${
                      e.regular ? "text-stone" : "bg-oxblood text-parchment"
                    }`}
                  >
                    {e.minutes !== undefined && <span className="font-semibold">{shortTime(e.minutes)} </span>}
                    {e.title}
                  </span>
                ))}
                {list.length > 3 && <span className="block px-1.5 text-xs font-semibold text-oxblood">+{list.length - 3} more</span>}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 bg-oxblood" aria-hidden /> Parish events
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 border border-stone/50" aria-hidden /> Weekly services
        </span>
      </p>

      <div className="mt-8 border-t-2 border-gold pt-6" aria-live="polite">
        <p className="eyebrow">{selected === today ? "Today" : formatDate(selected).weekday}</p>
        <h4 className="mt-2 font-display text-2xl md:text-3xl">{formatDate(selected).long}</h4>
        {selectedEvents.length ? (
          <ul className="mt-4 space-y-4">
            {selectedEvents.map((e) => (
              <li key={e.title + e.minutes} className="flex gap-4">
                <span className="w-36 shrink-0 text-sm font-semibold text-oxblood">{e.time ?? "All day"}</span>
                <span>
                  <span className={`block text-xl ${e.regular ? "text-ink-soft" : "text-ink"}`}>{e.title}</span>
                  {e.description && <span className="mt-1 block whitespace-pre-line text-ink-soft">{e.description}</span>}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-ink-soft">Nothing on the calendar this day.</p>
        )}
      </div>
    </div>
  );
}
