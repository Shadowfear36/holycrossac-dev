# Parish calendar

The Calendar of Events and the home page's "Upcoming Events" can show the parish **Google Calendar**
automatically, so Fr. Dave (and anyone he appoints) can add events without touching the website.

- **Calendar:** the Google account **holycross4him@gmail.com** (the same calendar the old website embedded).
- **Status:** connected but **switched off** (`calendarFeed.enabled: false` in `src/content/site.ts`) until the
  calendar is cleaned up, because it currently publishes outdated and internal items.

## 1. Clean up the calendar (needs the holycross4him@gmail.com login)

The calendar is public, so **everything in it is visible to anyone**. Before turning it on:

1. **End or delete outdated repeating events**
   - "Christian Education & Compline": Thursdays 6:30 p.m., repeats with no end date
   - "Book Study at Deacon Melinda's": Wednesdays 6:30 p.m. (also gives a private home as the location)
2. **Add current events**, e.g. Wednesday Bible Study 5:00 p.m. (repeating weekly), Lessons & Carols, Christmas Eve.
3. **Hide internal items** (vestry meetings, bookkeeping, staff meetings): open each and set
   **Visibility → Private**, or delete old ones. Private events never appear on the website.
4. **Check "Holy Communion" (Sundays 9:30 a.m.)** is still correct.

## 2. Give others access

calendar.google.com → (the calendar) → **Settings and sharing** → **Share with specific people or groups** →
add each person with **"Make changes to events"**. Leave **"Make available to public"** on.

## 3. Turn it on (website)

Set `enabled: true` under `calendarFeed` in `src/content/site.ts` and publish. Then:
- On the live site, changes in Google Calendar appear within about **5 minutes** (`functions/api/calendar.js`, a Cloudflare Pages Function).
- A snapshot is also saved at each publish (`/calendar-feed.json`) as a backup.
- Events typed into `events` in `site.ts` still show too; duplicates (same day and title) appear once.
- Repeating events show only their **next** occurrence. The weekly services box is separate (`services` in `site.ts`).
