/**
 * Turn the parish Google Calendar's public iCal feed into a list of upcoming events.
 * Shared by the build (snapshot) and the live Cloudflare Pages Function (functions/api/calendar.js),
 * so it must not depend on Next.js or Node-only APIs.
 *
 * - Expands repeating events (weekly, monthly…), honouring skipped dates and one-off changes
 * - Skips cancelled events
 * - Repeating series show only their NEXT occurrence (so a weekly event isn't listed 12 times)
 */
import ICAL from "ical.js";

export type FeedEvent = {
  id: string;
  title: string;
  start: string; // ISO date-time, or yyyy-mm-dd for all-day
  end?: string;
  allDay: boolean;
  location?: string;
  recurring: boolean;
};

export function upcomingFromIcs(
  icsText: string,
  { now = new Date(), days = 180, limit = 40 }: { now?: Date; days?: number; limit?: number } = {},
): FeedEvent[] {
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

  const from = now.getTime();
  const until = from + days * 86400_000;
  const out: FeedEvent[] = [];
  const cancelled = (c: ICAL.Component) => String(c.getFirstPropertyValue("status") ?? "").toUpperCase() === "CANCELLED";
  const toEvent = (ev: ICAL.Event, start: ICAL.Time, end: ICAL.Time | null, recurring: boolean, key: string): FeedEvent => ({
    id: `${ev.uid}-${key}`,
    title: (ev.summary || "").trim(),
    start: start.isDate ? start.toString().slice(0, 10) : start.toJSDate().toISOString(),
    end: end ? (end.isDate ? end.toString().slice(0, 10) : end.toJSDate().toISOString()) : undefined,
    allDay: start.isDate,
    location: (ev.location || "").trim() || undefined,
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

  for (const ev of masters.values()) {
    const it = ev.iterator();
    let next: ICAL.Time | null;
    let guard = 0;
    while ((next = it.next()) && guard++ < 5000) {
      const occ = ev.getOccurrenceDetails(next);
      if (occ.startDate.toJSDate().getTime() > until) break;
      if (endsAt(occ.startDate, occ.endDate) < from) continue;
      if (cancelled(occ.item.component)) continue;
      out.push(toEvent(occ.item, occ.startDate, occ.endDate, true, next.toString()));
      break; // only the next occurrence of a repeating series
    }
  }

  return out.sort((a, b) => a.start.localeCompare(b.start)).slice(0, limit);
}
