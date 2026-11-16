"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

/**
 * "Live now" / "Next livestream" banner, driven by the service schedule in
 * site.livestreamSchedule (Pacific time). It does not ask Facebook whether a stream
 * is actually running; that needs a Facebook developer key from a page admin.
 */

// Re-render once a minute (and not at all on the server)
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
};
const minuteNow = () => Math.floor(Date.now() / 60_000);
const serverNow = () => null;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Current weekday/hour/minute in the schedule's time zone. */
function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return { day: WEEKDAYS.indexOf(get("weekday")), hour: Number(get("hour")) % 24, minute: Number(get("minute")) };
}

function status(minute: number) {
  const s = site.livestreamSchedule;
  const now = new Date(minute * 60_000);
  const z = zonedParts(now, s.timeZone);
  const minsIntoWeek = z.day * 1440 + z.hour * 60 + z.minute;
  const start = s.day * 1440 + s.hour * 60 + s.minute;
  let untilStart = start - minsIntoWeek;
  if (untilStart <= -s.liveForMinutes) untilStart += 7 * 1440; // this week's has ended: next week's
  const live = untilStart <= s.showLiveFromMinutesBefore && untilStart > -s.liveForMinutes;
  const next = new Date(now.getTime() + Math.max(untilStart, 0) * 60_000);
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: s.timeZone,
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(next);
  const time = `${((s.hour + 11) % 12) + 1}:${String(s.minute).padStart(2, "0")} ${s.hour < 12 ? "a.m." : "p.m."}`;
  const today = untilStart < 24 * 60 && z.day === s.day;
  return { live, label, time, today };
}

/** Live/next-stream status from the schedule; null until the browser's clock is known. */
export function useLiveStatus() {
  const minute = useSyncExternalStore(subscribe, minuteNow, serverNow);
  return minute === null ? null : status(minute);
}

export default function LiveBanner({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const st = useLiveStatus();
  const dark = tone === "dark";

  // Before the clock is known (server render), show the schedule without a date
  const heading = st?.live
    ? "Sunday Worship is live now"
    : st
      ? `Next livestream: ${st.today ? "today" : st.label}`
      : "Sunday Worship is livestreamed";
  const sub = st?.live ? "Join us on Facebook" : `${st?.time ?? "9:30 a.m."} Pacific time, on Facebook`;

  return (
    <a
      href={site.social.livestream}
      target="_blank"
      rel="noopener"
      className={`group flex items-center gap-4 border p-5 transition-colors ${
        st?.live
          ? "border-oxblood bg-oxblood text-parchment hover:bg-oxblood-dark"
          : dark
            ? "border-gold/40 text-parchment hover:border-gold-light"
            : "border-gold/40 paper text-ink hover:border-oxblood"
      }`}
    >
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
        {st?.live && <span className="absolute h-full w-full animate-ping rounded-full bg-parchment/70" />}
        <span className={`relative h-3 w-3 rounded-full ${st?.live ? "bg-parchment" : "bg-oxblood"}`} />
      </span>
      <span className="flex-1">
        <span className="block font-display text-xl leading-tight sm:text-2xl">{heading}</span>
        <span className={`mt-1 block text-sm ${st?.live ? "text-parchment/85" : dark ? "text-parchment/70" : "text-stone"}`}>
          {sub}
        </span>
      </span>
      <span className="text-sm font-semibold uppercase tracking-wider transition-transform group-hover:translate-x-1">
        Watch →
      </span>
    </a>
  );
}
