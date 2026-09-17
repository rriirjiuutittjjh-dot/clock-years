import { GAME_NEWS, NEWS_LIMIT } from "@/lib/game-news";
import { useLocale } from "@/lib/i18n";

/** Item dates render per visitor locale ("28 Aug 2026" / "٢٨ أغسطس ٢٠٢٦" / …). */
function formatNewsDate(iso: string, locale?: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Latest headlines for the featured game (see src/lib/game-news.ts). */
export function GameNews() {
  const { t, locale } = useLocale();
  const items = GAME_NEWS.slice(0, NEWS_LIMIT);
  if (items.length === 0) return null;

  return (
    <div className="glass mx-auto w-full max-w-md rounded-[28px] px-5 py-4 text-left">
      <p className="text-[0.65rem] font-bold tracking-[0.28em] text-muted uppercase">
        {t.news.title}
      </p>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block no-underline"
            >
              <p className="text-[0.68rem] tracking-wide text-muted uppercase">
                {formatNewsDate(item.date, locale)} · {item.source}
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink group-hover:underline">
                {item.title}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
