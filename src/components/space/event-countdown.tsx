import { Fragment, useEffect, useState } from "react";
import { formatTarget, pad2, splitRange } from "@/lib/countdown";
import { currentEvent, upcomingGames, type ScheduledEvent } from "@/lib/events";
import { useLocale } from "@/lib/i18n";

type Snap = {
  parts: ReturnType<typeof splitRange>;
  released: boolean;
};

type Snapshot = {
  event: ScheduledEvent;
  snap: Snap;
  more: Array<{ event: ScheduledEvent; snap: Snap }>;
};

/** Render-time snapshot so the server paints the real timer on first paint. */
function snapshot(now: Date): Snapshot | null {
  const event = currentEvent(now);
  if (!event) return null;
  const snapOf = (target: Date): Snap => ({
    parts: splitRange(now, target),
    released: target.getTime() <= now.getTime(),
  });
  return {
    event,
    snap: snapOf(event.target),
    more: upcomingGames(now, event.id).map((game) => ({
      event: game,
      snap: snapOf(game.target),
    })),
  };
}

/** `2mo 14d` — calendar-aware, zero units hidden. */
function spanText(parts: ReturnType<typeof splitRange>) {
  return [
    parts.years > 0 ? `${parts.years}y` : null,
    parts.months > 0 ? `${parts.months}mo` : null,
    `${parts.days}d`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Card for the featured release (see src/lib/events.ts): title, localized
 * date and a live timer, plus an expandable "More releases" list of the
 * other upcoming games. Self-ticking, so it drops into any page. Shows
 * "Out now" once a release passes and renders nothing once every event is
 * long past.
 */
export function EventCountdown({ variant = "card" }: { variant?: "card" | "inline" }) {
  const { t, locale } = useLocale();
  const [snap, setSnap] = useState<Snapshot | null>(() => snapshot(new Date()));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => setSnap(snapshot(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!snap) return null;
  const { event, snap: main, more } = snap;

  return (
    <div
      className={
        variant === "card"
          ? "glass mx-auto w-full max-w-md rounded-[28px] px-5 py-4"
          : "mx-auto w-full max-w-md"
      }
    >
      <p className="text-[0.65rem] font-bold tracking-[0.28em] text-muted uppercase">
        {t.event.label}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{event.title}</p>
          <p className="mt-0.5 text-xs text-muted">
            {t.event.releases(formatTarget(event.target, locale))}
          </p>
        </div>
        {main.released ? (
          <p className="rounded-full bg-sun/15 px-3 py-1 text-xs font-bold tracking-[0.12em] text-sun uppercase">
            {t.event.outNow}
          </p>
        ) : (
          <p
            className="num text-xl tabular-nums"
            role="timer"
            aria-label={t.event.timerAria(
              main.parts.years,
              main.parts.months,
              main.parts.days,
              main.parts.hours,
              main.parts.minutes,
            )}
            suppressHydrationWarning
          >
            {spanText(main.parts)} {pad2(main.parts.hours)}:{pad2(main.parts.minutes)}:
            {pad2(main.parts.seconds)}
          </p>
        )}
      </div>

      {more.length > 0 ? (
        <Fragment>
          <button
            type="button"
            className="mt-3 text-xs font-semibold tracking-wide text-muted underline-offset-4 hover:text-ink hover:underline"
            aria-expanded={open}
            onClick={() => setOpen((next) => !next)}
          >
            {open ? t.event.less : t.event.more(more.length)}
          </button>
          {open ? (
            <ul className="event-list mt-3 space-y-2.5 border-t border-white/10 pt-3 text-left">
              {more.map(({ event: game, snap: item }) => (
                <li key={game.id} className="flex items-baseline justify-between gap-x-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{game.title}</p>
                    <p className="text-xs text-muted">
                      {t.event.releases(formatTarget(game.target, locale))}
                    </p>
                  </div>
                  {item.released ? (
                    <p className="flex-none text-[0.65rem] font-bold tracking-[0.12em] text-sun uppercase">
                      {t.event.outNow}
                    </p>
                  ) : (
                    <p className="flex-none text-xs tabular-nums text-muted">
                      {spanText(item.parts)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </Fragment>
      ) : null}
    </div>
  );
}
