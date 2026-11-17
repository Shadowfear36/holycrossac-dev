/**
 * Parish Life photo gallery.
 *
 * To add photos: put a .jpg in public/photos/gallery/ (and, optionally, a smaller copy with the
 * same name in public/photos/gallery/thumbs/). It appears on the site automatically.
 * Add it below to give it a caption or a place in the order; unlisted photos appear after these,
 * without a caption. Captions are only ever the parish's own words.
 */
export type GalleryEntry = { file: string; caption?: string };

export const galleryOrder: GalleryEntry[] = [
  { file: "holy-cross-members", caption: "Holy Cross members" },
  { file: "fr-dave-with-dog", caption: "Blessing of the Animals" },
  {
    file: "field-trip-holy-monastery-dunlap",
    caption: "Holy Cross’ field trip to Holy Monastery of the Theotokos the Lifegiving Spring, Dunlap, CA",
  },
  { file: "ruth-bible-study-music", caption: "Our Treasurer leading music at a Bible study of the Book of Ruth" },
  { file: "paschal-candle-fr-dave-dcn-melinda", caption: "Fr. Dave & Dcn. (ret.) Melinda lighting the Paschal Candle" },
  { file: "bible-study-naomi-teaching" },
  { file: "worship-service-clergy" },
  { file: "fellowship-home-gathering" },
  { file: "holy-cross-and-emmanuel-clergy", caption: "Holy Cross and Emmanuel clergy" },
  { file: "fellowship-mini-golf" },
  { file: "holy-cross-banner-group" },
  { file: "fellowship-party-balloon" },
  { file: "diocese-of-san-joaquin-clergy", caption: "Clergy of the ACNA Diocese of San Joaquin" },
];
