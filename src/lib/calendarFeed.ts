/**
 * Turn the parish Google Calendar's public iCal feed into event lists for the website.
 * Shared by the build (snapshot) and the live Cloudflare Pages Function (functions/api/calendar.js),
 * so it must not depend on Next.js or Node-only APIs.
 *
 * - Expands repeating events (weekly, monthly…), honouring skipped dates and one-off changes
 * - Skips cancelled events
 * - upcomingFromIcs: repeating series show only their NEXT occurrence (so a weekly event isn't listed 12 times)
 * - occurrencesFromIcs: every occurrence in a date range, for the month calendar
 */
import ICAL from "ical.js";

export type FeedEvent = {
  id: string;
  title: string;
  start: string; // ISO date-time, or yyyy-mm-dd for all-day
  end?: string;
  allDay: boolean;
  location?: string;
  description?: string;
  recurring: boolean;
};

/** Google puts some HTML in event descriptions; keep plain text only. */
function plainText(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type Options = { hideRepeating?: string[] };

/** Upcoming events (the next occurrence of each repeating series), soonest first. */
export function upcomingFromIcs(
  icsText: string,
  { now = new Date(), days = 180, limit = 40, hideRepeating = [] }: { now?: Date; days?: number; limit?: number } & Options = {},
): FeedEvent[] {
  return expand(icsText, now.getTime(), now.getTime() + days * 86400_000, true, hideRepeating).slice(0, limit);
}

/** Every occurrence from `monthsBack` whole months before now to `monthsAhead` months after, for the month calendar. */
export function occurrencesFromIcs(
  icsText: string,
  { now = new Date(), monthsBack = 1, monthsAhead = 12, hideRepeating = [] }: { now?: Date; monthsBack?: number; monthsAhead?: number } & Options = {},
): FeedEvent[] {
  const from = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsBack, 1) - 86400_000;
  const until = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + monthsAhead + 1, 1) + 86400_000;
  return expand(icsText, from, until, false, hideRepeating);
}

function expand(icsText: string, from: number, until: number, nextOnly: boolean, hideRepeating: string[]): FeedEvent[] {
  const root = new ICAL.Component(ICAL.parse(icsText));
  for (const tz of root.getAllSubcomponents("vtimezone")) ICAL.TimezoneService.register(tz);

  const vevents = root.getAllSubcomponents("vevent");
  const masters = new Map<string, ICAL.Event>();
  const singles: ICAL.Event[] = [];
  for (const v of vevents) {
    if (v.hasProperty("recurrence-id")) continue;
    const ev = new ICAL.Event(v, { strictExceptions: false });
    if (ev.isRecurring()) masters.set(ev.uid, ev);
    else singles.push(ev);
  }
  // attach one-off changes ("this event only" edits) to their series
  for (const v of vevents) {
    if (!v.hasProperty("recurrence-id")) continue;
    const ex = new ICAL.Event(v, { strictExceptions: false });
    masters.get(ex.uid)?.relateException(ex);
  }

  const out: FeedEvent[] = [];
  const cancelled = (c: ICAL.Component) => String(c.getFirstPropertyValue("status") ?? "").toUpperCase() === "CANCELLED";
  const toEvent = (ev: ICAL.Event, start: ICAL.Time, end: ICAL.Time | null, recurring: boolean, key: string): FeedEvent => ({
    id: `${ev.uid}-${key}`,
    title: (ev.summary || "").trim(),
    start: start.isDate ? start.toString().slice(0, 10) : start.toJSDate().toISOString(),
    end: end ? (end.isDate ? end.toString().slice(0, 10) : end.toJSDate().toISOString()) : undefined,
    allDay: start.isDate,
    location: (ev.location || "").trim() || undefined,
    description: plainText(ev.description || "") || undefined,
    recurring,
  });
  // an event is "upcoming" until it has ended (all-day: through the end of its day)
  const endsAt = (start: ICAL.Time, end: ICAL.Time | null) =>
    (end ?? start).toJSDate().getTime() + (start.isDate && !end ? 86400_000 : 0);

  for (const ev of singles) {
    if (cancelled(ev.component) || !ev.startDate) continue;
    const startMs = ev.startDate.toJSDate().getTime();
    if (endsAt(ev.startDate, ev.endDate) < from || startMs > until) continue;
    out.push(toEvent(ev, ev.startDate, ev.endDate, false, "single"));
  }

  const hidden = hideRepeating.map((h) => h.toLowerCase());
  for (const ev of masters.values()) {
    const title = (ev.summary || "").trim().toLowerCase();
    if (hidden.some((h) => title.startsWith(h))) continue;
    const it = ev.iterator();
    let next: ICAL.Time | null;
    let guard = 0;
    while ((next = it.next()) && guard++ < 5000) {
      const occ = ev.getOccurrenceDetails(next);
      if (occ.startDate.toJSDate().getTime() > until) break;
      if (endsAt(occ.startDate, occ.endDate) < from) continue;
      if (cancelled(occ.item.component)) continue;
      out.push(toEvent(occ.item, occ.startDate, occ.endDate, true, next.toString()));
      if (nextOnly) break; // only the next occurrence of a repeating series
    }
  }

  return out.sort((a, b) => a.start.localeCompare(b.start));
}
