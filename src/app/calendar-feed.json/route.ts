import { site } from "@/content/site";
import { occurrencesFromIcs, upcomingFromIcs, type FeedEvent } from "@/lib/calendarFeed";

/**
 * Build-time snapshot of the parish Google Calendar → /calendar-feed.json.
 * Backup for the live version (functions/api/calendar.js on Cloudflare), and what
 * `npm run dev` uses. If the calendar can't be reached at build time, it's an empty list.
 */
export const dynamic = "force-static";

export async function GET() {
  let events: FeedEvent[] = [];
  let occurrences: FeedEvent[] = [];
  if (site.calendarFeed.enabled) {
    try {
      const res = await fetch(site.calendarFeed.ics);
      if (res.ok) {
        const ics = await res.text();
        const opts = { hideRepeating: site.calendarFeed.hideRepeating };
        events = upcomingFromIcs(ics, opts);
        occurrences = occurrencesFromIcs(ics, opts);
      }
    } catch {
      // offline at build time: leave empty; the live endpoint covers it on the real site
    }
  }
  return Response.json({ updated: new Date().toISOString(), events, occurrences });
}
