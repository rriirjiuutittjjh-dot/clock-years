import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { PLANETS } from "@/components/space/solar-system";
import { PLANET_FACTS } from "@/components/space/planet-data";
import { useLocale } from "@/lib/i18n";

export function PlanetView({ name, onClose }: { name: string; onClose: () => void }) {
  const { t, locale } = useLocale();
  const planet = PLANETS.find((p) => p.name === name);
  const facts = PLANET_FACTS[name];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!planet || !facts) return null;

  const fmt = new Intl.NumberFormat(locale);
  const rings = "rings" in planet && planet.rings === true;
  const rows = [
    { label: t.planet.diameter, value: `${fmt.format(facts.diameterKm)} km` },
    { label: t.planet.distance, value: `${facts.distanceAu} AU` },
    { label: t.planet.day, value: facts.day },
    { label: t.planet.year, value: facts.year },
    { label: t.planet.moons, value: fmt.format(facts.moons) },
  ];

  return createPortal(
    <div
      className="planet-modal"
      role="dialog"
      aria-modal="true"
      aria-label={name}
      onClick={onClose}
    >
      <div className="planet-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="icon-btn glass planet-close"
          onClick={onClose}
          aria-label={t.planet.close}
          autoFocus
        >
          <X className="size-4" />
        </button>
        <svg className="planet-orb" viewBox="0 0 96 96" aria-hidden="true">
          <defs>
            <radialGradient id="planet-orb-skin" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor={planet.c1} />
              <stop offset="55%" stopColor={planet.c1} />
              <stop offset="100%" stopColor={planet.c2} />
            </radialGradient>
          </defs>
          {rings ? (
            <ellipse
              cx="48"
              cy="48"
              rx="40"
              ry="12"
              fill="none"
              stroke="#f2e4bb"
              strokeWidth="3"
              opacity="0.9"
              transform="rotate(-18 48 48)"
            />
          ) : null}
          <circle cx="48" cy="48" r="30" fill="url(#planet-orb-skin)" />
        </svg>
        <h2 className="planet-title">{name}</h2>
        <dl className="planet-rows">
          {rows.map((r) => (
            <div key={r.label} className="planet-row">
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    document.body,
  );
}
