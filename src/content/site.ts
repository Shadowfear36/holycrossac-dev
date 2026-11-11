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
  // Old site shows a broken address ("email.holycrossac.org"). NEEDED.
  email: "",

  social: {
    facebook: "https://www.facebook.com/HolyCrossSanger",
    youtube: "https://www.youtube.com/@HolyCrossAnglicanChurch",
    livestream: "https://www.facebook.com/HolyCrossSanger/videos/",
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
export const clergy: { name: string; role: string; photo: string; bio: string }[] = [
  { name: "Fr. Dave", role: "", photo: "clergy-fr-dave", bio: "" },
];

// NEEDED: vestry names and offices
export const vestry: { name: string; role: string }[] = [];

export type ParishEvent = { date: string; time?: string; title: string; description?: string };

// NEEDED: real parish events (ISO dates, yyyy-mm-dd)
export const events: ParishEvent[] = [];

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
    ],
  },
  {
    label: "Connect",
    href: "/events/",
    children: [
      { label: "Calendar of Events", href: "/events/" },
      { label: "Resources", href: "/resources/" },
    ],
  },
  { label: "Contact", href: "/contact/" },
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
      { label: "Liturgical Calendar", href: "https://liturgical-calendar.com/en/ACNA", image: "/images/bcp-pew-edition.jpg", fit: "contain" },
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
