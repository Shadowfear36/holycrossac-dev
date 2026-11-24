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

/**
 * Lasting gifts (adapted from Emmanuel's page at Fr. Dave's request, Nov 2026; Emmanuel's own funds and
 * legacy society left out). Each ends with a link to contact the parish.
 */
export const lastingGifts = [
  {
    title: "Gift of Securities",
    text: "Appreciated securities make a fantastic gift to the church. You may be eligible to take advantage of a two-fold tax savings. First, you avoid paying any capital gains tax on the increase in value of your stock. In addition, you receive a tax deduction for the full fair market value of the stock on the date of the gift.",
  },
  {
    title: "Gift of Real Estate",
    text: "If you owned your home, a vacation home, acreage, or a farm for many years, a charitable gift of that real estate can be especially tax-advantageous. The property may have so appreciated in value over the years that its sale would result in a sizable capital gains tax. If given to the church, you avoid the capital gains tax and realize a charitable deduction for the full fair market value of the real estate. It also removes this large asset from your taxable estate.",
  },
  {
    title: "Gift of Life Insurance",
    text: "If you own a life insurance policy that is no longer needed, it could be the perfect gift vehicle for a year-end charitable gift. You can contribute a life insurance policy either by declaring Holy Cross Anglican Church as the owner of the policy or simply the beneficiary. It’s easy to contribute a life insurance policy – just check with your life insurance agent for details on which forms to complete.",
  },
  {
    title: "Gift of Individual Retirement Accounts",
    text: "The church can be designated as the beneficiary of all or a portion of a retirement account at death. A gift of this type provides an estate tax charitable deduction for the value of the amount distributed to the church. It also provides important benefits by limiting the tax on income in respect of a decedent.",
  },
  {
    title: "Planned Giving",
    text: "Planned giving is a term used to describe a variety of ways that gifts can be made to the church from accumulated resources. Usually, planned giving involves financial or estate planning. Types of planned gifts may include: a bequest in a will; a life income gift, such as a pooled income fund, a charitable gift annuity, or a charitable remainder trust; gifts of real estate; closely held stock; life insurance; retirement accounts; and more. Planned giving is not only for the wealthy. Planned giving is a means of Christian stewardship whereby one is concerned with the wise use of his or her personal resources and their ultimate disposition.",
  },
];

/** The Generosity Roadmap: the journey of growing in giving, first step to last. */
export const roadmap = [
  { title: "Initial Giver", text: "Take your first step in giving." },
  { title: "Intentional Giver", text: "Give a set percentage of your income for the next year." },
  { title: "Growing Giver", text: "Increase the percentage you give toward a tithe (10%)." },
  { title: "Established Giver", text: "Begin to give a tithe (10%) of your income." },
  { title: "Extravagant Giver", text: "Begin to give offerings beyond your tithe (10%)." },
  { title: "Legacy Giver", text: "When you die, give a portion of your estate to the Church." },
];

export const waysToGive: { title: string; text: string; showMailing?: boolean; href?: string; hrefLabel?: string }[] = [
  {
    title: "Sunday Worship",
    href: "/worship/",
    hrefLabel: "Service times",
    text: "Simply place cash or checks in the offering plate. Be sure to include your name and address on the check or envelope, so that a donation credit may be provided for tax purposes.",
  },
  {
    title: "Mail",
    text: "Mail your gift to the address below. Be sure to include your name and address on the check or envelope, so that a donation credit may be provided for tax purposes.",
    showMailing: true,
  },
];
