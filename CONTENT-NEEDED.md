# Content needed from the parish

Nothing on this site is invented. Text comes word for word from the old holycrossac.org.
Anything missing shows a dashed **"Content needed"** box. Here is the full list:

## Confirm
- [x] **Phone number:** 559-255-4883 (confirmed as the church's only number).
- [ ] **Mailing name.** Old contact page says "Church of the Holy Cross, P.O. Box 425". Still correct?

## Needed
- [x] **Parish email address:** email@holycrossac.org (from Fr. Dave; domain has working mail servers).
- [x] **Fr. Dave:** name, credentials, bio, and portrait (Nov 2026).
- [x] **Vestry:** members and offices (Nov 2026).
- [ ] **Other regular services** besides Sunday 9:30 a.m. (weekday, holy days), if any
- [x] **Events:** Advent through First Sunday of Christmas 2026 (past events hide themselves; add new ones in `src/content/site.ts`).
- [x] **New visitor guide:** "What to Expect" from Fr. Dave (Nov 2026).
- [x] **Giving:** Tithe.ly online giving link added (`givingUrl` in `site.ts`).
  Previously listed: online link (if any), how to make checks payable, where to mail
- [x] **Vestry Documents:** not on the site (Fr. Dave: no reports, minutes or financials at this time).
- [x] **Photos:** received from Fr. Dave and placed (see `photos/README.md`). Still nice to have: a photo of the church building and the inside of the nave, for the About page banner (currently the low-res icon from the old site).

## Outreach ministries (added Nov 2026)
- [ ] Photos for each ministry (they appear automatically; names in `public/photos/README.md`)
- [x] One Child wording from Fr. Dave: Margyecy, "a resident of Mushanje Hope Center of Kigezi, Uganda". HOPE Sanger confirmed.

## Design choices to approve (not facts, but please confirm)
- [x] Featured quote on the home page: Luke 9:23 (KJV), chosen by Fr. Dave (replaced the Archbishop Fisher quote).
- [ ] Section headings like "Welcome", "Visit us", "Watch online" are plain labels added for layout.

- [x] **Event times:** Lessons & Carols 5 pm (+ dinner). Advent is a season (liturgical calendar), not an event.
- [x] **Calendar:** the parish Google Calendar (holycross4him@gmail.com) is connected and on. Old repeating events and internal items still to tidy in Google; see `CALENDAR.md`.
- [x] **Parish Life uploads:** Google Drive folder, live on the Parish Life page. See `GALLERY.md`.
- [x] **Blessing of animals / gathering photos** for Parish Life (drop into `public/photos/gallery/`).

## From Fr. Dave's Nov 18 batch
- [ ] **Photo of Millie Menees** for her outreach card (`public/photos/outreach-millie-menees.jpg`); a styled placeholder shows until then.
- [ ] **Bishop's title:** shown as "Bishop Ordinary of the Diocese of San Joaquin" (Fr. Dave wrote "Bishop to the Ordinary if the Diocese…"). Confirm the wording.
- [x] **Giving QR code** (church colours, cross in the middle) → the hidden quick-giving page holycrossac.org/give-now/: `print/giving-qr.png` (for the bulletin; not on the website) and `.svg`. It only works once the new site is live on holycrossac.org. Re-make with `node scripts/make-giving-qr.mjs`.
