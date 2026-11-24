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

  // Vision & Mission, verbatim from Fr. Dave (Nov 2026); featured prominently on the home page
  vision: "To go in peace to love and serve the Lord.",
  mission:
    "To love God and make disciples for Jesus Christ through his word and through serving in His name at the heart of Fresno County, rooted in the tradition of the Anglican Church.",

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
  // Confirmed Nov 2026: the church's correct and only phone number (559-721-2027 on the old site was wrong).
  phone: "559-255-4883",
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

  // The parish Google Calendar (account holycross4him@gmail.com), which the old website embedded.
  // Its upcoming events appear on the Calendar of Events and home page automatically (merged with
  // any events listed below in `events`). See CALENDAR.md.
  calendarFeed: {
    enabled: true,
    // Repeating events whose title starts with one of these are left off the events list: they are the
    // regular weekly services, already shown on the Worship page (`services`). One-off events still show.
    hideRepeating: ["Holy Communion", "Bible Study"],
    ics: "https://calendar.google.com/calendar/ical/holycross4him%40gmail.com/public/basic.ics",
    view: "https://calendar.google.com/calendar/embed?src=holycross4him%40gmail.com&ctz=America%2FLos_Angeles",
  },

  // Parish Life photos uploaded to this Google Drive folder ("HolyCrossAC-Website-Gallery", shared as
  // "Anyone with the link can view") appear on the Parish Life page automatically. See GALLERY.md.
  galleryDrive: {
    enabled: true,
    folderId: "1DGfs3G6YtSM27NCEXdeOtMDTMdX1GIth",
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

  // Online giving: the parish's Tithe.ly form (from Fr. Dave, Nov 2026)
  givingUrl: "https://give.tithe.ly/?formId=a6379e51-031e-4944-bff9-22d7d5b8bf87",

  diocese: { name: "Anglican Diocese of San Joaquin", url: "https://www.dioceseofsanjoaquin.net/", logo: "/images/diocese-logo.png" },
  province: { name: "Anglican Church in North America", url: "https://anglicanchurch.net/", logo: "/images/acna-logo.png" },
  // Fr. Dave (Nov 2026): add the Anglican Communion, listed after the ACNA. (Their site blocks automated
  // downloads, so the card shows the name instead of a logo; add one at public/images/ and set `logo`.)
  communion: { name: "The Anglican Communion", url: "https://www.anglicancommunion.org/", logo: "" },
};

export type ServiceTime = { day: string; time: string; name: string; note?: string };

// Old site, home page: "Please join us for Sunday worship! ... 9:30 a.m. Our services are live streamed"
// NEEDED: any other regular services (weekday, holy days)
export const services: ServiceTime[] = [
  // From Fr. Dave (Nov 2026)
  { day: "Sunday", time: "9:30 a.m.", name: "Holy Eucharist", note: "With music and Communion. Our services are live streamed." },
  { day: "Wednesday", time: "5:00 p.m.", name: "Bible Study", note: "Contact Fr. Dave at the church number for details." },
];

// Clergy & Staff
export type Clergy = {
  name: string;
  credentials?: string;
  role: string;
  photo: string;
  bio: string[];
  source?: { label: string; href: string };
};
// From Fr. Dave (Nov 2026), verbatim
export const clergy: Clergy[] = [
  {
    // Bio: the Anglican Diocese of San Joaquin website (Bishop & Staff page), verbatim, at Fr. Dave's
    // request (Nov 2026); listed first per Fr. Dave. Name, title and DMin per Fr. Dave.
    // Photo: the headshot Fr. Dave chose (as on Emmanuel's site), background matched.
    name: "The Rt. Rev. Eric Menees",
    credentials: "DMin",
    role: "Bishop Ordinary of the Diocese of San Joaquin",
    photo: "clergy-bishop-eric-menees",
    bio: [
      "Bishop Eric Menees was born in Compton, California on November 21, 1961 and is a tenth generation Los Angelino. Bishop Menees graduated from the General Theological Seminary with an M.Div and from Seabury Western Theological Seminary with a D.Min. Following his ordination Bishop Menees served Spanish language congregations in East Los Angeles and Santa Ana in the Diocese of Los Angeles. From there he was called to the Diocese of San Diego to be the chaplain at The Bishop’s School in La Jolla, California and later as vicar and then rector of Grace Church, San Marcos.",
      "In 2011 by God’s grace Bishop Menees was elected the fifth bishop of San Joaquin succeeding Bishop John David Schofield. Bishop Menees serves as bishop for Caminemos Juntos the ACNA Spanish Language ministry support network, leads the Border Bishops’ Conference seeking to evangelize and plant churches in Mexico, is the ACNA representative to the Anglican Province of South America and the United States Conference of Catholic Bishops.",
      "Bishop Menees is married to Florence Guadalupe and has two grown children, Milagro a registered nurse, and Sebastian a firefighter.",
    ],
    source: { label: "Anglican Diocese of San Joaquin", href: "https://www.dioceseofsanjoaquin.net/bishop--staff.html" },
  },
  {
    name: "The Rev. David A. Peterson III",
    credentials: "MDiv, MHA, PBCC, LSSBB",
    role: "Rector",
    photo: "clergy-fr-dave",
    bio: [
      "Father Dave has served as rector of Holy Cross Anglican Church for three and a half years. Before ordination, he spent many years in healthcare administration and business leadership. He holds a Master of Divinity from Nashotah House Theological Seminary. He serves on the diocesan Commission on Ministry and is a member of the diocesan ecclesiastical court. He is also a volunteer chaplain with Community Regional Medical Center and the Sanger Police Department. Father Dave is married and the father of two adult daughters. He welcomes you to Holy Cross.",
    ],
  },
  {
    // From Fr. Dave (Nov 2026). Background matched to Fr. Dave's headshot.
    name: "Dcn. (ret.) Melinda Barrow",
    role: "Deacon (Retired)",
    photo: "clergy-melinda-barrow",
    bio: [],
  },
  {
    // From Fr. Dave (Nov 2026), verbatim. Staff, listed after Dcn. Melinda.
    name: "Troy Zweifler",
    role: "Parish Organist & Music Coordinator",
    photo: "staff-troy-zweifler",
    bio: [
      "Troy serves our parish as organist and music coordinator, bringing his love of music to the worship of the Church. In collaboration with Father Dave, he selects hymns that complement the appointed Scriptures and liturgical themes, helping lead the congregation in prayer, praise, and thanksgiving to God.",
    ],
  },
];

// NEEDED: vestry names and offices
// bio: paragraphs; firstPerson bios (the member's own words) are shown as a quotation.
export type VestryMember = {
  name: string;
  role: string;
  bio?: string[];
  firstPerson?: boolean;
  photo?: string;
  /** CSS object-position for the square crop (default "50% 22%") */
  photoPosition?: string;
};
// From Fr. Dave (Nov 2026). Bios verbatim as sent.
export const vestry: VestryMember[] = [
  { name: "Beverly Worrell", role: "Senior Warden", photo: "vestry-beverly-worrell" }, // photo Nov 2026, background matched
  {
    // photo: Tim at the altar (his choice, Nov 2026), cropped from the gallery photo; background matched (--clip-mask)
    name: "Tim Lueth",
    role: "Junior Warden",
    photo: "vestry-tim-lueth",
    firstPerson: true,
    bio: [
      "I have been part of this church community since its founding and have enjoyed serving the parish in many capacities. My ministries include singing in the choir, serving as an acolyte and church delegate, counting the weekly offering, opening and closing the church, and coordinating the monthly schedule for acolytes, lay readers, and those who open and close the church.",
    ],
  },
  {
    name: "Cynthia Shaheen",
    role: "Secretary",
    photo: "vestry-cynthia-shaheen",
    photoPosition: "50% 36%", // whole face incl. chin
    bio: [
      "Cynthia brings a wonderful spirit of service to Holy Cross, shaped by many years of active involvement in church ministry. Her service has included roles as a Lay Eucharistic Minister, Crucifer, Usher, Lay Reader, and in the Altar Guild and Hospitality ministries. She is also a member of The Daughters of the Holy Cross.",
      "Professionally, Cynthia spent 17 years in the airline industry, including 15 years with Continental Airlines, and later retired from Fresno Unified School District after 22 years of service.",
      "Cynthia and her husband, Chuck, have one son. In her free time, she enjoys walking, gardening, scrapbooking, cooking, and baking.",
    ],
  },
  { name: "Sayre Miller", role: "Treasurer", photo: "vestry-sayre-miller" }, // cropped from the Ruth Bible study photo, background matched
  {
    // Bio from Fr. Dave (Nov 2026), verbatim from the printed page; photo background matched
    name: "Robin Wood",
    role: "Vestry Member & Outreach Ministries Coordinator",
    photo: "vestry-robin-wood",
    bio: [
      "Robin oversees our outreach ministries, Feeding All God’s Children. She joined the Vestry at Holy Cross in 2025.",
      "Professionally, she has worked managing health programs through the California Health Collaborative, health education at Kaiser Permanente, is adjunct faculty at Fresno State and currently works for California’s Valued Trust promoting staff health and wellness at over 200 school districts in California.",
      "Robin and her husband, Harold, love spending time with family and are enjoying the grandparent stage with two boys and a girl. She also loves to travel, both near and far, play tennis, be active and stay connected with friends and family.",
    ],
  },
  {
    name: "Charlene Rogde",
    role: "Vestry Member",
    photo: "vestry-charlene-rogde",
    photoPosition: "50% 80%", // her face sits low in the photo: centre it in the square
    firstPerson: true,
    bio: ["I am one of the newest catechumen and vestry members at the Holy Cross Anglican Church. I became a church member on September 13th, 2026. I also enjoy serving with the hospitality team, which provides refreshments after Sunday service."],
  },
];

export type ParishEvent = { date: string; time?: string; title: string; description?: string };

// NEEDED: real parish events (ISO dates, yyyy-mm-dd)
// From Fr. Dave (Nov 2026). Past events hide themselves automatically (see EventList).
export const events: ParishEvent[] = [
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
      { label: "Clergy, Staff & Vestry", href: "/clergy/" },
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
      { label: "Parish Life", href: "/parish-life/" },
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
  /** Optional YouTube video shown in place of the photo */
  video?: { youtubeId: string; title: string };
};
export const outreach: Ministry[] = [
  {
    id: "one-child",
    name: "One Child",
    description: "We sponsor Margyecy, a resident of Mushanje Hope Center of Kigezi, Uganda.",
    photo: "outreach-one-child",
    link: { label: "Visit Mushanje Hope Center", href: "https://app.bridgely.org/communities/a0vVT000000e44vYAA" },
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
  {
    // From Fr. Dave (Nov 2026). NEEDED: a photo of Millie (public/photos/outreach-millie-menees.jpg)
    id: "millie-menees",
    name: "Missionary Millie Menees",
    description: "We have sent support to Millie Menees for her missionary work in the Philippines. She serves through SEND International.",
    photo: "outreach-millie-menees",
    link: { label: "Visit SEND International", href: "https://www.send.org/" },
  },
  {
    // Fr. Dave (Nov 2026): the ARDF video only, as embedded on emmanuelfresno.org/anglicanism
    id: "ardf",
    name: "Anglican Relief and Development Fund",
    description: "“The Global Anglican Communion,” a video from the Anglican Relief and Development Fund (ARDF).",
    photo: "outreach-ardf",
    video: { youtubeId: "IpL6zfCZbJY", title: "The Global Anglican Communion" },
    link: { label: "Visit ARDF", href: "https://ardf.org/" },
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
      { label: "Our Diocesan Website", href: "https://www.dioceseofsanjoaquin.net/", image: "/images/diocese-logo.png", fit: "contain" },
      { label: "The ACNA", href: "https://anglicanchurch.net/", image: "/images/acna-logo.png", fit: "contain" },
      { label: "The Anglican Communion", href: "https://www.anglicancommunion.org/", image: "", fit: "contain" },
    ],
  },
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
