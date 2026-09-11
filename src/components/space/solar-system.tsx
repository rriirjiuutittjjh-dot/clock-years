import { useEffect, useState } from "react";

const CX = 450;
const CY = 110;
const SUN_X = 196;

/** The four drawn orbit tracks (rx/ry match the backdrop ellipses below). Inner tracks run faster. */
const ORBITS = [
  { rx: 150, ry: 28, dur: 10 },
  { rx: 240, ry: 48, dur: 16 },
  { rx: 330, ry: 70, dur: 26 },
  { rx: 410, ry: 92, dur: 38 },
] as const;

/** Full ellipse loop starting at the rightmost point of the track. */
function orbitPath(rx: number, ry: number): string {
  return (
    `M ${CX + rx} ${CY} ` +
    `A ${rx} ${ry} 0 1 1 ${CX - rx} ${CY} ` +
    `A ${rx} ${ry} 0 1 1 ${CX + rx} ${CY} Z`
  );
}

const PLANETS = [
  { name: "Mercury", r: 5.2, fill: "#b7a48c", x: 268, orbit: 0 },
  { name: "Venus", r: 8.4, fill: "#e2c07a", x: 312, orbit: 0 },
  { name: "Earth", r: 8.8, fill: "#4f8fce", x: 358, orbit: 1 },
  { name: "Mars", r: 6.4, fill: "#c45c3e", x: 400, orbit: 1 },
  { name: "Jupiter", r: 16, fill: "#d9a066", x: 456, orbit: 2 },
  { name: "Saturn", r: 13.5, fill: "#e6d3a3", x: 520, orbit: 2, rings: true },
  { name: "Uranus", r: 10, fill: "#7ec8c8", x: 580, orbit: 3 },
  { name: "Neptune", r: 9.6, fill: "#4b6fd6", x: 632, orbit: 3 },
] as const;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function SolarSystem() {
  // SMIL motion can't be switched off from CSS, so reduced-motion renders the
  // classic static lineup instead of the revolving orrery.
  const reduced = usePrefersReducedMotion();

  return (
    <div className="solar-wrap" aria-hidden="true">
      <svg className="solar-svg" viewBox="0 0 900 220" role="img">
        <title>Solar system</title>
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6d2" />
            <stop offset="42%" stopColor="#f0d48a" />
            <stop offset="100%" stopColor="#f0d48a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunCore" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#fff4c8" />
            <stop offset="55%" stopColor="#f0d48a" />
            <stop offset="100%" stopColor="#d7a24a" />
          </radialGradient>
        </defs>

        <g fill="none" stroke="rgba(232,226,255,0.16)" strokeWidth="1">
          {ORBITS.map((o) => (
            <ellipse key={o.rx} cx={CX} cy={CY} rx={o.rx} ry={o.ry} />
          ))}
        </g>

        <circle className="sun-glow" cx={SUN_X} cy={CY} r="52" fill="url(#sunGlow)" opacity="0.9" />
        <circle cx={SUN_X} cy={CY} r="28" fill="url(#sunCore)" />
        <circle cx={SUN_X - 10} cy={CY - 10} r="7" fill="#fff8dc" opacity="0.45" />

        {PLANETS.map((p, i) => {
          const track = ORBITS[p.orbit];
          // Pair-mates start half a lap apart so they never bunch up.
          const begin = `-${((i % 2) * track.dur) / 2}s`;
          return (
            <g key={p.name} transform={reduced ? `translate(${p.x} ${CY})` : undefined}>
              {reduced ? null : (
                <animateMotion
                  dur={`${track.dur}s`}
                  begin={begin}
                  repeatCount="indefinite"
                  path={orbitPath(track.rx, track.ry)}
                />
              )}
              {"rings" in p && p.rings ? (
                <ellipse
                  cx="0"
                  cy="0"
                  rx="24"
                  ry="7"
                  fill="none"
                  stroke="#e8d9b0"
                  strokeWidth="2.2"
                  opacity="0.85"
                  transform="rotate(-18)"
                />
              ) : null}
              <circle r={p.r} fill={p.fill} />
              {p.name === "Earth" ? <circle cx="-2" cy="-1" r="3.2" fill="#3d8a62" opacity="0.85" /> : null}
              {p.name === "Jupiter" ? (
                <>
                  <ellipse cx="0" cy="-4" rx="14" ry="3.2" fill="#c9844c" opacity="0.55" />
                  <ellipse cx="0" cy="5" rx="13" ry="2.4" fill="#efd0a0" opacity="0.45" />
                </>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
