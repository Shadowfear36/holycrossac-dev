/**
 * Cloudflare Pages Function: GET /api/calendar
 * Reads the parish Google Calendar live and returns its upcoming events as JSON,
 * so edits in Google Calendar show on the website within a few minutes.
 * Settings (calendar address, on/off) come from src/content/site.ts → calendarFeed.
 * (Cloudflare bundles this file and its imports automatically on deploy.)
 */
import { site } from "../../src/content/site.ts";
import { upcomingFromIcs } from "../../src/lib/calendarFeed.ts";

const FRESH_SECONDS = 300; // re-read Google at most every 5 minutes

export async function onRequestGet() {
  if (!site.calendarFeed.enabled) {
    return Response.json({ updated: new Date().toISOString(), events: [], disabled: true });
  }
  try {
    const res = await fetch(site.calendarFeed.ics, { cf: { cacheTtl: FRESH_SECONDS, cacheEverything: true } });
    if (!res.ok) throw new Error(`calendar responded ${res.status}`);
    const events = upcomingFromIcs(await res.text());
    return Response.json(
      { updated: new Date().toISOString(), events },
      { headers: { "Cache-Control": `public, max-age=${FRESH_SECONDS}` } },
    );
  } catch (err) {
    return Response.json({ error: String(err), events: [] }, { status: 502 });
  }
}
