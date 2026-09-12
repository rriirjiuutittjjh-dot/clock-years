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
              <stop offset="45%" stopColor={planet.c1} />
              <stop offset="100%" stopColor={planet.c2} />
            </radialGradient>
            <clipPath id="planet-orb-clip">
              <circle cx="48" cy="48" r="30" />
            </clipPath>
          </defs>
          {rings ? (
            <ellipse
              className="planet-ring"
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
          <g clipPath="url(#planet-orb-clip)">
            {name === "Earth" ? (
              <>
                <circle cx="40" cy="44" r="7" fill="#3fb97f" opacity="0.9" />
                <ellipse cx="57" cy="55" rx="8" ry="5.5" fill="#3fb97f" opacity="0.9" />
                <ellipse cx="48" cy="21" rx="12" ry="4" fill="#ffffff" opacity="0.75" />
              </>
            ) : null}
            {name === "Jupiter" ? (
              <>
                <ellipse cx="48" cy="39" rx="27" ry="6" fill="#e8934f" opacity="0.6" />
                <ellipse cx="48" cy="51" rx="28" ry="3.4" fill="#c9763a" opacity="0.55" />
                <ellipse cx="48" cy="60" rx="25" ry="4.5" fill="#ffedc4" opacity="0.5" />
              </>
            ) : null}
            {name === "Mars" ? (
              <>
                <ellipse cx="40" cy="56" rx="10" ry="6" fill="#7e2a12" opacity="0.5" />
                <ellipse cx="48" cy="22" rx="9" ry="3.6" fill="#ffffff" opacity="0.8" />
              </>
            ) : null}
            {name === "Venus" ? (
              <ellipse cx="48" cy="44" rx="29" ry="7" fill="#ffffff" opacity="0.28" />
            ) : null}
            {name === "Uranus" ? (
              <ellipse cx="48" cy="48" rx="29" ry="5" fill="#ffffff" opacity="0.2" />
            ) : null}
            {name === "Neptune" ? (
              <>
                <ellipse cx="48" cy="57" rx="28" ry="4.5" fill="#1a2480" opacity="0.4" />
                <circle cx="59" cy="39" r="3.2" fill="#ffffff" opacity="0.55" />
              </>
            ) : null}
            <ellipse cx="59" cy="60" rx="24" ry="22" fill="#06030f" opacity="0.28" />
            <ellipse cx="38" cy="35" rx="11" ry="7" fill="#ffffff" opacity="0.5" />
          </g>
          {rings ? (
            <path
              className="planet-ring"
              d="M 8 48 A 40 12 0 0 0 88 48"
              fill="none"
              stroke="#f2e4bb"
              strokeWidth="3"
              opacity="0.95"
              transform="rotate(-18 48 48)"
            />
          ) : null}
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
