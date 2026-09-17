import { useEffect, useState } from "react";
import { formatTarget, pad2, splitRange } from "@/lib/countdown";
import { currentEvent, type ScheduledEvent } from "@/lib/events";
import { useLocale } from "@/lib/i18n";

type Snapshot = {
  event: ScheduledEvent;
  parts: ReturnType<typeof splitRange>;
  released: boolean;
};

/** Render-time snapshot so the server paints the real timer on first paint. */
function snapshot(now: Date): Snapshot | null {
  const event = currentEvent(now);
  if (!event) return null;
  return {
    event,
    parts: splitRange(now, event.target),
    released: event.target.getTime() <= now.getTime(),
  };
}

/**
 * Compact card for the next scheduled event (see src/lib/events.ts): title,
 * localized release date and a live `d hh:mm:ss` timer. Self-ticking, so it
 * drops into any page. Shows "Out now" once the moment passes and renders
 * nothing once every event is long past.
 */
export function EventCountdown({ variant = "card" }: { variant?: "card" | "inline" }) {
  const { t, locale } = useLocale();
  const [snap, setSnap] = useState<Snapshot | null>(() => snapshot(new Date()));

  useEffect(() => {
    const tick = () => setSnap(snapshot(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!snap) return null;
  const { event, parts, released } = snap;

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
        {released ? (
          <p className="rounded-full bg-sun/15 px-3 py-1 text-xs font-bold tracking-[0.12em] text-sun uppercase">
            {t.event.outNow}
          </p>
        ) : (
          <p
            className="num text-xl tabular-nums"
            role="timer"
            aria-label={t.event.timerAria(
              parts.years,
              parts.months,
              parts.days,
              parts.hours,
              parts.minutes,
            )}
            suppressHydrationWarning
          >
            {[
              parts.years > 0 ? `${parts.years}y` : null,
              parts.months > 0 ? `${parts.months}mo` : null,
              `${parts.days}d`,
            ]
              .filter(Boolean)
              .join(" ")}{" "}
            {pad2(parts.hours)}:{pad2(parts.minutes)}:{pad2(parts.seconds)}
          </p>
        )}
      </div>
    </div>
  );
}
