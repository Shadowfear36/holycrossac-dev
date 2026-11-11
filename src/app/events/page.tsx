import type { Metadata } from "next";
import Needed from "@/components/Needed";
import PageHero from "@/components/PageHero";
import { events, services } from "@/content/site";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = { title: "Calendar of Events" };

export default function Events() {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHero eyebrow="Connect" title="Calendar of Events" />

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-3">
        <div className="md:col-span-2">
          {sorted.length ? (
            <ul className="divide-y divide-gold/25">
              {sorted.map((e) => {
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
          ) : (
            <Needed>
              Parish events (date, time, title, short description). Add them to{" "}
              <code>events</code> in <code>src/content/site.ts</code>, or we can embed a Google
              Calendar the office maintains.
            </Needed>
          )}
        </div>

        <aside className="h-fit paper-deep p-7">
          <p className="eyebrow">Every week</p>
          <ul className="mt-4 space-y-4">
            {services.map((s) => (
              <li key={s.day + s.time}>
                <p className="font-display text-2xl text-oxblood">{s.day} {s.time}</p>
                <p className="text-ink-soft">{s.name}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
}
