# Parish calendar

The Calendar of Events and the home page's "Upcoming Events" show the parish **Google Calendar**
automatically, so Fr. Dave (and anyone he appoints) can add events without touching the website.

- **Calendar:** the Google account **holycross4him@gmail.com** (the same calendar the old website embedded).
- **Status:** **on** (`calendarFeed.enabled: true` in `src/content/site.ts`).

## Adding an event

Add it in Google Calendar as usual. What shows on the website:
- the **title**, **date** and **time** (start – end),
- the **location** and **description**, if filled in (e.g. "Followed by dinner").

Changes appear on the live site within about **5 minutes**.

## Keep in mind: the calendar is public

**Everything in it is visible to anyone**, on the website and in Google. For internal items (vestry meetings,
bookkeeping, staff meetings), open the event and set **Visibility → Private**; private events never appear on
the website. Don't put a private home address in a public event.

## Regular weekly services

Repeating events whose title starts with **"Holy Communion"** or **"Bible Study"** are left off the events list,
because the weekly services are already shown on the Worship page (`services` in `site.ts`). One-off events with
those names (e.g. "Easter Holy Communion") still show. The list is `calendarFeed.hideRepeating` in `site.ts`.

Other repeating events show only their **next** occurrence.

Still to tidy in the calendar (they don't show on the website, but are public in Google):
- "Bible Study at Deacon Melinda's", Wednesdays 5:00 p.m., repeats with no end date and names a private home.
- "Holy Communion", Sundays 9:30 a.m., repeats with no end date.
- Old internal items (vestry meetings, bookkeeping, the Nov 2025 meeting): set to Private or delete.

## Giving others access

calendar.google.com → (the calendar) → **Settings and sharing** → **Share with specific people or groups** →
add each person with **"Make changes to events"**. Leave **"Make available to public"** on.

## How it works (website)

- Live: `functions/api/calendar.js` (a Cloudflare Pages Function) reads the calendar's public iCal feed.
- Backup: a snapshot is saved at each publish (`/calendar-feed.json`), also used by `npm run dev`.
- Events typed into `events` in `site.ts` still show too; duplicates (same day and title) appear once.
- To switch the calendar off, set `enabled: false` under `calendarFeed` in `site.ts` and publish.
