/**
 * All church content lives here so it can be edited in one place.
 *
 * RULE: Only content supplied by the parish goes here. Text below is taken
 * verbatim from the old holycrossac.org unless noted. Empty values render a
 * "Content needed" box on the site. See CONTENT-NEEDED.md.
 */

export const site = {
  name: "Holy Cross Anglican Church",
  url: "https://holycrossac.org",

  // Old site, home page
  vision: "Our Vision is to Go in Peace to Love and Serve the Lord.",
  mission:
    "Our Mission is to love God and make disciples for Jesus Christ through His Word and through serving in His Name in the heart of Fresno County, rooted in the tradition of the Anglican Church.",

  address: {
    street: "828 O Street",
    city: "Sanger",
    state: "CA",
    zip: "93657",
    mapUrl: "https://maps.google.com/?q=828+O+Street,+Sanger,+CA+93657",
    mapEmbed: "https://www.google.com/maps?q=828+O+Street,+Sanger,+CA+93657&output=embed",
  },
  // Old site, contact page
  mailing: ["Church of the Holy Cross", "P.O. Box 425", "Sanger, CA 93657"],
  // Old site footer shows 559-721-2027; contact page body says 559-255-4883. NEEDS CONFIRMING.
  phone: "559-721-2027",
  // From Fr. Dave (Nov 2026). The old site showed it with a typo ("email.holycrossac.org").
  email: "email@holycrossac.org",

  social: {
    facebook: "https://www.facebook.com/HolyCrossSanger",
    youtube: "https://www.youtube.com/@HolyCrossAnglicanChurch",
    // Channel ID (from the channel page). Its "uploads" playlist is UU + the rest of the ID,
    // which YouTube's embed player shows newest-first and keeps up to date by itself.
    youtubeChannelId: "UCPZeGPTEcF1IEwmQbYWjDDg",
    livestream: "https://www.facebook.com/HolyCrossSanger/videos/",
  },

  // When the Sunday service is livestreamed on Facebook (Pacific time). Drives the
  // "Live now / Next livestream" banner. day: 0 = Sunday.
  livestreamSchedule: {
    day: 0,
    hour: 9,
    minute: 30,
    showLiveFromMinutesBefore: 10,
    liveForMinutes: 90,
    timeZone: "America/Los_Angeles",
  },

  // NEEDED: how the parish receives gifts (online link, mail, etc.)
  givingUrl: "",

  diocese: { name: "Anglican Diocese of San Joaquin", url: "https://www.dioceseofsanjoaquin.net/", logo: "/images/diocesan-seal.png" },
  province: { name: "Anglican Church in North America", url: "https://anglicanchurch.net/", logo: "/images/acna.png" },
};

export type ServiceTime = { day: string; time: string; name: string; note?: string };

// Old site, home page: "Please join us for Sunday worship! ... 9:30 a.m. Our services are live streamed"
// NEEDED: any other regular services (weekday, holy days)
export const services: ServiceTime[] = [
  { day: "Sunday", time: "9:30 a.m.", name: "Sunday Worship", note: "Our services are live streamed." },
];

// NEEDED: full name, title, bio, photo. "Fr. Dave" is all we have so far.
export type Clergy = { name: string; credentials?: string; role: string; photo: string; bio: string[] };
// From Fr. Dave (Nov 2026), verbatim
export const clergy: Clergy[] = [
  {
    name: "The Rev. David A. Peterson III",
    credentials: "MDiv, MHA, PBCC, LSSBB",
    role: "Rector",
    photo: "clergy-fr-dave",
    bio: [
      "Father Dave has served as rector of Holy Cross Anglican Church for three and a half years. Before ordination, he spent many years in healthcare administration and business leadership. He holds a Master of Divinity from Nashotah House Theological Seminary. He serves on the diocesan Commission on Ministry and is a member of the diocesan ecclesiastical court. He is also a volunteer chaplain with Community Regional Medical Center and the Sanger Police Department. Father Dave is married and the father of two adult daughters. He welcomes you to Holy Cross.",
    ],
  },
];

// NEEDED: vestry names and offices
export type VestryMember = { name: string; role: string; bio?: string; photo?: string };
// From Fr. Dave (Nov 2026). Bios are the members' own words.
export const vestry: VestryMember[] = [
  { name: "Beverly Worrell", role: "Senior Warden" },
  { name: "Tim Lueth", role: "Junior Warden" },
  { name: "Cynthia Shaheen", role: "Secretary" },
  { name: "Sayre Miller", role: "Treasurer" },
  { name: "Robin Wood", role: "Outreach Coordinator" },
  {
    name: "Charlene Rogde",
    role: "Vestry Member",
    photo: "vestry-charlene-rogde",
    bio: "I am one of the newest catechumen and vestry members at the Holy Cross Anglican Church. I became a church member on September 13th, 2026. I also enjoy serving with the hospitality team, which provides refreshments after Sunday service.",
  },
];

export type ParishEvent = { date: string; time?: string; title: string; description?: string };

// NEEDED: real parish events (ISO dates, yyyy-mm-dd)
// From Fr. Dave (Nov 2026). Past events hide themselves automatically (see EventList).
export const events: ParishEvent[] = [
  { date: "2026-11-29", title: "Advent Begins" },
  { date: "2026-12-06", title: "Lessons & Carols", description: "At Emmanuel Church Cathedral" },
  { date: "2026-12-12", time: "2:00 – 4:30 p.m.", title: "Christmas Party" },
  { date: "2026-12-24", time: "3:00 p.m.", title: "Christmas Eve Day Service" },
  { date: "2026-12-27", title: "First Sunday of Christmas" },
];

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const nav: NavItem[] = [
  {
    label: "Welcome",
    href: "/about/",
    children: [
      { label: "I'm New Here", href: "/new-here/" },
      { label: "About Us", href: "/about/" },
      { label: "What We Believe", href: "/about/#beliefs" },
      { label: "Clergy & Vestry", href: "/clergy/" },
    ],
  },
  {
    label: "Worship",
    href: "/worship/",
    children: [
      { label: "Sunday Worship", href: "/worship/" },
      { label: "Watch Online", href: "/worship/#livestream" },
      { label: "The Sacraments", href: "/about/#sacraments" },
      { label: "The Daily Office", href: "/resources/#daily-office" },
    ],
  },
  {
    label: "Connect",
    href: "/events/",
    children: [
      { label: "Outreach Ministries", href: "/outreach/" },
      { label: "Calendar of Events", href: "/events/" },
      { label: "Resources", href: "/resources/" },
    ],
  },
  { label: "Contact", href: "/contact/" },
];

// Outreach ministries, as described by Fr. Dave (Nov 2026).
// `photo` is a file name in public/photos/ (no extension); the card shows it once the file exists.
export type Ministry = {
  id: string;
  name: string;
  description: string;
  photo: string;
  /** Optional link to a partner organization */
  link?: { label: string; href: string };
};
export const outreach: Ministry[] = [
  {
    id: "one-child",
    name: "One Child",
    description: "We sponsor Margyecy from the Diocese of Kigezi, Uganda.",
    photo: "outreach-one-child",
  },
  {
    id: "angel-ministry",
    name: "Angel Ministry",
    description: "We help one of our own in need.",
    photo: "outreach-angel-ministry",
  },
  {
    id: "daughters-of-the-holy-cross",
    name: "Daughters of the Holy Cross",
    description: "They pray for people and provide food and bag lunches for the HOPE Sanger charity.",
    photo: "outreach-daughters-of-the-holy-cross",
    link: { label: "Visit HOPE Sanger", href: "https://hopesanger.org/" },
  },
  {
    id: "outreach-bible-study",
    name: "Outreach Bible Study",
    description: "Bible study with visits to assisted living facilities.",
    photo: "outreach-bible-study",
  },
  {
    id: "family-support",
    name: "Family Support",
    description: "Delivering food to assist a family who is not part of our parish.",
    photo: "outreach-family-support",
  },
];

// Old site, resources page (same links, same labels, same thumbnail images)
export type ResourceLink = { label: string; href: string; image: string; fit: "cover" | "contain" };
export const resources: { group: string; links: ResourceLink[] }[] = [
  {
    group: "Worship",
    links: [
      { label: "Our Worship Services", href: "https://www.facebook.com/HolyCrossSanger/videos/", image: "/images/worship-services.jpg", fit: "cover" },
      { label: "Visit us on YouTube", href: "https://www.youtube.com/@HolyCrossAnglicanChurch", image: "/images/jerusalem-cross.jpg", fit: "contain" },
      { label: "The Daily Office", href: "https://www.dailyoffice2019.com/", image: "/images/daily-office.jpg", fit: "cover" },
      { label: "Liturgical Calendar", href: "https://www.dailyoffice2019.com/calendar", image: "/images/bcp-pew-edition.jpg", fit: "contain" },
    ],
  },
  {
    group: "Our Wider Church",
    links: [
      { label: "Our Diocesan Website", href: "https://www.dioceseofsanjoaquin.net/", image: "/images/diocesan-seal.png", fit: "contain" },
      { label: "The ACNA", href: "https://anglicanchurch.net/", image: "/images/acna.png", fit: "contain" },
    ],
  },
];

// Old site, vestry documents page. Categories only; NEEDED: the actual files.
export const vestryDocumentCategories = [
  "Bishop's Reports",
  "Parish Profile",
  "Financial Reports",
  "Vestry Minutes",
  "Vestry Meeting Agendas",
  "Annual Meetings",
  "Articles and Bylaws",
  "Vestry Meeting Packets",
];

// The Daily Office (dailyoffice2019.com), the parish's liturgical calendar (Fr. Dave, Nov 2026).
// These links always open on today's office, so they never need updating.
export const dailyOffice = {
  site: "https://www.dailyoffice2019.com/",
  calendar: "https://www.dailyoffice2019.com/calendar",
  offices: [
    { label: "Morning Prayer", href: "https://www.dailyoffice2019.com/office/morning_prayer" },
    { label: "Midday Prayer", href: "https://www.dailyoffice2019.com/office/midday_prayer" },
    { label: "Evening Prayer", href: "https://www.dailyoffice2019.com/office/evening_prayer" },
    { label: "Compline", href: "https://www.dailyoffice2019.com/office/compline" },
  ],
  podcast: [
    { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/the-daily-office-podcast/id1574821838" },
    { label: "Spotify", href: "https://dailyofficepodcast.captivate.fm/spotify" },
    { label: "RSS feed", href: "https://dailyofficepodcast.captivate.fm/rssfeed" },
  ],
};
