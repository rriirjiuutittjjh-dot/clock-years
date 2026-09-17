/**
 * Game news — the latest headlines for the featured game, newest first.
 * Headlines and outlet names stay verbatim (real quotes are not translated);
 * only the section chrome around them is localized (see the `news` i18n key).
 *
 * Swapping the covered game = editing this file only.
 */
export type NewsItem = {
  id: string;
  /** ISO date (YYYY-MM-DD) — formatted per visitor locale at render time. */
  date: string;
  title: string;
  source: string;
  url: string;
};

export const NEWS_LIMIT = 4;

export const GAME_NEWS: readonly NewsItem[] = [
  {
    id: "gta-vi-netflix-extended-look",
    date: "2026-08-28",
    title: "GTA 6 drops 27 minutes of new in-game footage on Netflix",
    source: "Variety",
    url: "https://variety.com/2026/tv/news/gta-6-netflix-trailer-extended-look-release-1236845475/",
  },
  {
    id: "gta-vi-trailer-3",
    date: "2026-08-28",
    title: "Grand Theft Auto VI unveils Trailer 3 — a deeper look into Vice City",
    source: "Meristation",
    url: "https://en.as.com/meristation/news/grand-theft-auto-6-finally-unveils-its-highly-anticipated-trailer-3-giving-us-a-deeper-look-into-vice-city-f202608-n/",
  },
  {
    id: "gta-vi-preorders",
    date: "2026-07-05",
    title: "GTA VI preorders open: $79.99 standard and $99.99 Ultimate Editions",
    source: "The Verge",
    url: "https://www.theverge.com/23987993/gta-6-news-trailers-rockstar-games",
  },
  {
    id: "gta-vi-november-date",
    date: "2025-11-06",
    title: "Grand Theft Auto VI is now set to launch November 19, 2026",
    source: "Rockstar Newswire",
    url: "https://www.rockstargames.com/newswire?tag=vi",
  },
];
