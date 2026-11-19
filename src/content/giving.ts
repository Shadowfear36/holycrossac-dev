/**
 * Give page. At Fr. Dave's request (Nov 2026), adapted for Holy Cross from Emmanuel Anglican Church's
 * "A Culture of Generosity" page (emmanuelfresno.org/a-culture-of-generosity): the teaching on tithes
 * and almsgiving, the Generosity Roadmap, and the ways to give. Emmanuel-specific items (their funds,
 * building campaign, legacy society, address) are left out. Mailing address: site.mailing.
 */

export const givingIntro =
  "Holy Cross Anglican Church relies on the grace and mercy of God and the generosity of our friends and members. Please prayerfully consider supporting our ministries and outreach in any of the ways on this page.";

export const tithes = {
  heading: "Tithes & Offerings",
  canon: {
    text: "With the help of God's grace, it shall be the duty of every member of the Church: … To give regular financial support to the Church, with the biblical tithe as the minimum standard of giving.",
    cite: "Title I, Canon 10 §2",
  },
  paragraphs: [
    "The tithe is a portion of one's goods which is given to God and His Church. These offerings are a “sacrifice” or “oblation” given to God and are used to further the work of the Church.",
    "All members in good standing of the Anglican Church in North America are expected to give the Biblical Tithe, which is 10% of their income (Deuteronomy 14:22–26).",
  ],
};

export const alms = {
  heading: "Almsgiving",
  paragraphs: [
    "Almsgiving is not the same as the tithe, but goes above the minimum 10% owed to God. Alms are funds which are set apart specifically for the poor and needy.",
    "Almsgiving is sacramental, as whatever is given to the poor is given directly to God (Proverbs 19:17), as Christ has identified Himself with the poor (Matthew 25:40–45).",
  ],
};

/** The Generosity Roadmap: the journey of growing in giving, first step to last. */
export const roadmap = [
  { title: "Initial Giver", text: "Take your first step in giving." },
  { title: "Intentional Giver", text: "Give a set percentage of your income for the next year." },
  { title: "Growing Giver", text: "Increase the percentage you give toward a tithe (10%)." },
  { title: "Established Giver", text: "Begin to give a tithe (10%) of your income." },
  { title: "Extravagant Giver", text: "Begin to give offerings beyond your tithe (10%)." },
  { title: "Legacy Giver", text: "When you die, give a portion of your estate to the Church." },
];

export const waysToGive = [
  {
    title: "Sunday Worship",
    text: "Simply place cash or checks in the offering plate. Be sure to include your name and address on the check or envelope, so that a donation credit may be provided for tax purposes.",
  },
  {
    title: "Mail",
    text: "Mail your gift to the address below. Be sure to include your name and address on the check or envelope, so that a donation credit may be provided for tax purposes.",
    showMailing: true,
  },
];
