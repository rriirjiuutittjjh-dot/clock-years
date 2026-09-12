import { Fragment } from "react";
import { pad2, UNITS, type Unit } from "@/lib/countdown";
import { useLocale } from "@/lib/i18n";

type Parts = Record<Unit, number>;

export function CountdownClock({ parts, compact = false }: { parts: Parts; compact?: boolean }) {
  const { t } = useLocale();
  const wide = parts.days >= 100;
  return (
    <div
      className={`countdown${wide ? " wide" : ""}`}
      role="timer"
      aria-label={t.countdown.ariaLabel(
        parts.days,
        pad2(parts.hours),
        pad2(parts.minutes),
        pad2(parts.seconds),
      )}
    >
      {UNITS.map((unit, i) => (
        <Fragment key={unit}>
          {i > 0 && !compact ? (
            <div className="colon" aria-hidden="true">
              :
            </div>
          ) : null}
          <div className="unit">
            <div className="num">
              {unit === "days" ? String(parts.days).padStart(2, "0") : pad2(parts[unit])}
            </div>
            <div className="unit-label">{t.countdown.units[unit]}</div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
