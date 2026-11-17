import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { services } from "@/content/site";
import { EventsList } from "@/components/UpcomingEvents";

export const metadata: Metadata = { title: "Calendar of Events" };

export default function Events() {
  return (
    <>
      <PageHero eyebrow="Connect" title="Calendar of Events" />

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-3">
        <div className="md:col-span-2">
          <EventsList />
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
