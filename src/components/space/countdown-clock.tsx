import { Fragment } from "react";
import { pad2, UNIT_LABELS, UNITS, type Unit } from "@/lib/countdown";

type Parts = Record<Unit, number>;

export function CountdownClock({ parts, compact = false }: { parts: Parts; compact?: boolean }) {
  const wide = parts.days >= 100;
  return (
    <div
      className={`countdown${wide ? " wide" : ""}`}
      role="timer"
      aria-label={`${parts.days} days ${pad2(parts.hours)} hours ${pad2(parts.minutes)} minutes ${pad2(parts.seconds)} seconds`}
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
            <div className="unit-label">{UNIT_LABELS[unit]}</div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
