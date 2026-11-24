"use client";

/**
 * The parish calendar in the browser: one shared copy of the Google Calendar feed for every component
 * on the page (upcoming lists, month calendar), loaded live from /api/calendar on Cloudflare (else the
 * build snapshot /calendar-feed.json), and refreshed every 10 minutes and whenever the tab comes back
 * into view, so an open page keeps up with changes made in Google Calendar.
 */
import { useSyncExternalStore } from "react";
import { events as typedEvents, services, site, type ParishEvent } from "@/content/site";
import type { FeedEvent } from "@/lib/calendarFeed";

export const TZ = site.livestreamSchedule.timeZone;

/** An event as the website shows it. `minutes` = start time (minutes after midnight) for ordering. */
export type CalEvent = ParishEvent & { minutes?: number; regular?: boolean };

type Feed = { events: CalEvent[]; occurrences: CalEvent[] };
const EMPTY: Feed = { events: [], occurrences: [] };

const ymd = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d); // yyyy-mm-dd, Pacific
const clock = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" })
    .format(d)
    .replace("AM", "a.m.")
    .replace("PM", "p.m.");
const minutesOf = (d: Date) => {
  const [h, m] = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .format(d)
    .split(":")
    .map(Number);
  return h * 60 + m;
};

/** "9:30 a.m." → 570 (for typed events and the weekly services) */
export function minutesFromText(t?: string): number | undefined {
  const m = t?.match(/(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m/i);
  if (!m) return undefined;
  return ((Number(m[1]) % 12) + (m[3].toLowerCase() === "p" ? 12 : 0)) * 60 + Number(m[2] ?? 0);
}

function fromFeed(e: FeedEvent): CalEvent {
  const description = [e.location, e.description].filter(Boolean).join("\n") || undefined;
  if (e.allDay) return { date: e.start.slice(0, 10), title: e.title, description };
  const d = new Date(e.start);
  const date = ymd(d);
  let time = clock(d);
  // "2:00 – 4:30 p.m." when it ends the same day
  if (e.end) {
    const end = new Date(e.end);
    if (ymd(end) === date && end > d) {
      const endTime = clock(end);
      time = time.slice(-4) === endTime.slice(-4) ? `${time.slice(0, -5)} – ${endTime}` : `${time} – ${endTime}`;
    }
  }
  return { date, time, title: e.title, description, minutes: minutesOf(d) };
}

// ---- shared store ----
let feed: Feed = EMPTY;
let started = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function load(url: string) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(String(r.status));
  const j = (await r.json()) as { events?: FeedEvent[]; occurrences?: FeedEvent[] };
  if (!j.events) throw new Error("no events");
  return { events: j.events.map(fromFeed), occurrences: (j.occurrences ?? j.events).map(fromFeed) };
}
async function refresh() {
  try {
    feed = await load("/api/calendar").catch(() => load("/calendar-feed.json"));
    emit();
  } catch {
    // keep what we have
  }
}
function start() {
  if (started || !site.calendarFeed.enabled) return;
  started = true;
  refresh();
  setInterval(refresh, 10 * 60_000);
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && refresh());
}
function subscribeFeed(cb: () => void) {
  listeners.add(cb);
  start();
  return () => listeners.delete(cb);
}
const getFeed = () => feed;
const getEmpty = () => EMPTY;

// "today" in Pacific time; null while prerendering (before the browser's clock is known)
const subscribeMinute = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};
const todayPacific = () => ymd(new Date());
const serverToday = () => null;
export const useToday = () => useSyncExternalStore(subscribeMinute, todayPacific, serverToday);

const typed: CalEvent[] = typedEvents.map((e) => ({ ...e, minutes: minutesFromText(e.time) }));
const key = (e: CalEvent) => `${e.date}|${e.title.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
export const byTime = (a: CalEvent, b: CalEvent) => a.date.localeCompare(b.date) || (a.minutes ?? -1) - (b.minutes ?? -1);

function merge(lists: CalEvent[][]): CalEvent[] {
  const seen = new Set<string>();
  return lists
    .flat()
    .filter((e) => (seen.has(key(e)) ? false : (seen.add(key(e)), true)))
    .sort(byTime);
}

/** Upcoming parish events (next occurrence of anything repeating), soonest first; past ones drop off by themselves. */
export function useUpcoming(limit?: number): CalEvent[] {
  const today = useToday();
  const f = useSyncExternalStore(subscribeFeed, getFeed, getEmpty);
  const list = merge([typed, f.events]).filter((e) => today === null || e.date >= today);
  return limit ? list.slice(0, limit) : list;
}

/** Every event occurrence (calendar + typed events), for the month calendar. */
export function useOccurrences(): CalEvent[] {
  const f = useSyncExternalStore(subscribeFeed, getFeed, getEmpty);
  return merge([typed, f.occurrences]);
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/** The regular weekly services (site.ts → services) on a given day; weekday 0 = Sunday. */
export function servicesOn(weekday: number, date: string): CalEvent[] {
  return services
    .filter((s) => s.day === WEEKDAYS[weekday])
    .map((s) => ({ date, time: s.time, title: s.name, minutes: minutesFromText(s.time), regular: true }));
}
