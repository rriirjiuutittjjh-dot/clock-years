import { useState } from "react";
import { PlanetView } from "@/components/space/planet-view";
import { useTheme } from "@/components/theme-provider";

const CX = 450;
const CY = 110;
/** The sun sits at the orbit center so the planets truly revolve around it. */
const SUN_X = CX;

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

/**
 * Planet skins: lit face (c1) melting into shadow (c2), rendered as
 * radial gradients so every body reads round. Static lineup spreads the
 * full 900 width with the sun in line at center.
 */
export const PLANETS = [
  { name: "Mercury", r: 5.2, c1: "#e0bda0", c2: "#7a5a44", x: 60, orbit: 0 },
  { name: "Venus", r: 8.4, c1: "#ffe9ad", c2: "#d18a3c", x: 150, orbit: 0 },
  { name: "Earth", r: 8.8, c1: "#7dd3fc", c2: "#1d4ed8", x: 240, orbit: 1 },
  { name: "Mars", r: 6.4, c1: "#ffa06e", c2: "#b53a1e", x: 330, orbit: 1 },
  { name: "Jupiter", r: 16, c1: "#ffda94", c2: "#b06a35", x: 570, orbit: 2 },
  { name: "Saturn", r: 13.5, c1: "#f8e9bf", c2: "#c9a05c", x: 670, orbit: 2, rings: true },
  { name: "Uranus", r: 10, c1: "#a8f3f0", c2: "#2a9a9e", x: 770, orbit: 3 },
  { name: "Neptune", r: 9.6, c1: "#9abcff", c2: "#2f3fd0", x: 860, orbit: 3 },
] as const;

type Moon = { name: string; rx: number; r: number; fill: string };

/** The moons of each planet (Mercury and Venus have none). rx clears the planet body. */
const MOONS: Partial<Record<string, Moon[]>> = {
  Earth: [{ name: "Moon", rx: 14, r: 2.6, fill: "#d8d8e0" }],
  Mars: [
    { name: "Phobos", rx: 10.5, r: 1.7, fill: "#b9a89a" },
    { name: "Deimos", rx: 14, r: 1.4, fill: "#9d9088" },
  ],
  Jupiter: [
    { name: "Io", rx: 21, r: 2.4, fill: "#e8d47a" },
    { name: "Europa", rx: 24.5, r: 2, fill: "#dfe4ea" },
    { name: "Ganymede", rx: 28, r: 2.8, fill: "#b0a89c" },
    { name: "Callisto", rx: 31.5, r: 2.5, fill: "#8f8a80" },
  ],
  Saturn: [
    { name: "Mimas", rx: 27, r: 1.5, fill: "#cfc8b8" },
    { name: "Enceladus", rx: 30, r: 1.7, fill: "#e8f0f2" },
    { name: "Tethys", rx: 33, r: 1.9, fill: "#d5d2c6" },
    { name: "Dione", rx: 36, r: 1.8, fill: "#c2beb0" },
    { name: "Rhea", rx: 39, r: 2.2, fill: "#b5b0a2" },
    { name: "Titan", rx: 42, r: 2.8, fill: "#e0a94e" },
    { name: "Hyperion", rx: 45, r: 1.4, fill: "#a89a88" },
    { name: "Iapetus", rx: 48, r: 2, fill: "#8a8578" },
  ],
  Uranus: [
    { name: "Puck", rx: 14, r: 1.4, fill: "#9aa0a8" },
    { name: "Miranda", rx: 17, r: 1.6, fill: "#b9beb9" },
    { name: "Ariel", rx: 20, r: 1.9, fill: "#cfd4cd" },
    { name: "Umbriel", rx: 23, r: 1.8, fill: "#8f938f" },
    { name: "Titania", rx: 26, r: 2.2, fill: "#c6cbc4" },
    { name: "Oberon", rx: 29, r: 2.1, fill: "#b0a89e" },
  ],
  Neptune: [
    { name: "Proteus", rx: 14, r: 1.7, fill: "#8d8f96" },
    { name: "Triton", rx: 18, r: 2.3, fill: "#e3d9c8" },
  ],
};

/** Moon orbits share the tilted-ellipse look, squashed so tall systems never clip the frame. */
const MOON_RY = 0.38;

/** Full ellipse loop around the planet center (the planet group sits at the origin). */
function moonPath(rx: number): string {
  const ry = rx * MOON_RY;
  return (
    `M ${rx} 0 ` +
    `A ${rx} ${ry} 0 1 1 ${-rx} 0 ` +
    `A ${rx} ${ry} 0 1 1 ${rx} 0 Z`
  );
}

/** Darken a hex color by factor f for moon shadow sides. */
function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const RAYS = Array.from({ length: 12 }, (_, i) => i * 30);

export function SolarSystem() {
  // SMIL motion can't be switched off from CSS, so motion-off renders the
  // classic static lineup instead of the revolving orrery.
  const { motion, space } = useTheme();
  const reduced = motion === "off";
  const [selected, setSelected] = useState<string | null>(null);
  // Space off hides the whole system-space scene (background fades via CSS).
  if (space === "off") return null;

  return (
    <div className="solar-wrap">
      <svg className="solar-svg" viewBox="0 0 900 220">
        <title>Solar system</title>
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3c4" />
            <stop offset="45%" stopColor="#ffcf6e" />
            <stop offset="100%" stopColor="#ff9e4a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunCore" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#fffbe8" />
            <stop offset="55%" stopColor="#ffd166" />
            <stop offset="100%" stopColor="#ef7d32" />
          </radialGradient>
          <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2c2160" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#1d1650" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1d1650" stopOpacity="0" />
          </radialGradient>
          {PLANETS.map((p) => (
            <radialGradient
              key={p.name}
              id={`skin-${p.name}`}
              cx="35%"
              cy="30%"
              r="80%"
            >
              <stop offset="0%" stopColor={p.c1} />
              <stop offset="55%" stopColor={p.c1} />
              <stop offset="100%" stopColor={p.c2} />
            </radialGradient>
          ))}
          {Object.entries(MOONS).flatMap(([planet, moons]) =>
            (moons ?? []).map((m) => (
              <radialGradient
                key={`${planet}-${m.name}`}
                id={`mskin-${planet}-${m.name}`}
                cx="35%"
                cy="30%"
                r="80%"
              >
                <stop offset="0%" stopColor={m.fill} />
                <stop offset="60%" stopColor={m.fill} />
                <stop offset="100%" stopColor={shade(m.fill, 0.5)} />
              </radialGradient>
            )),
          )}
        </defs>

        <ellipse cx={CX} cy={CY} rx="445" ry="108" fill="url(#nebula)" />

        <g className="orbit-track" fill="none" stroke="rgba(196,181,253,0.30)" strokeWidth="1">
          {ORBITS.map((o) => (
            <ellipse key={o.rx} cx={CX} cy={CY} rx={o.rx} ry={o.ry} />
          ))}
        </g>

        {PLANETS.map((p, i) => {
          const track = ORBITS[p.orbit];
          // Pair-mates start half a lap apart so they never bunch up.
          const begin = `-${((i % 2) * track.dur) / 2}s`;
          const moons = MOONS[p.name] ?? [];
          return (
            <g
              key={p.name}
              transform={reduced ? `translate(${p.x} ${CY})` : undefined}
              className="planet-btn"
              role="button"
              tabIndex={0}
              aria-label={p.name}
              onClick={() => setSelected(p.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(p.name);
                }
              }}
            >
              {reduced ? null : (
                <animateMotion
                  dur={`${track.dur}s`}
                  begin={begin}
                  repeatCount="indefinite"
                  path={orbitPath(track.rx, track.ry)}
                />
              )}
              {"rings" in p && p.rings ? (
                <>
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="30"
                    ry="9"
                    fill="none"
                    stroke="#f2e4bb"
                    strokeWidth="1.2"
                    opacity="0.35"
                    transform="rotate(-18)"
                  />
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="24"
                    ry="7"
                    fill="none"
                    stroke="#f2e4bb"
                    strokeWidth="2.2"
                    opacity="0.9"
                    transform="rotate(-18)"
                  />
                </>
              ) : null}
              <title>{p.name}</title>
              <circle r={p.r} fill={`url(#skin-${p.name})`} />
              {p.name === "Earth" ? <circle cx="-2" cy="-1" r="3.2" fill="#3fb97f" opacity="0.9" /> : null}
              {p.name === "Jupiter" ? (
                <>
                  <ellipse cx="0" cy="-4" rx="14" ry="3.2" fill="#e8934f" opacity="0.6" />
                  <ellipse cx="0" cy="5" rx="13" ry="2.4" fill="#ffedc4" opacity="0.5" />
                </>
              ) : null}
              {moons.map((m, j) => {
                const ry = m.rx * MOON_RY;
                const dur = 4 + m.rx * 0.22;
                // Static lineup spreads moons evenly around the planet;
                // the orrery spreads them around the lap instead.
                const theta = (j / moons.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <g key={m.name} className="moon-sys">
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={m.rx}
                      ry={ry}
                      fill="none"
                      stroke="rgba(232,226,255,0.16)"
                      strokeWidth="0.8"
                    />
                    <g
                      transform={
                        reduced
                          ? `translate(${(Math.cos(theta) * m.rx).toFixed(1)} ${(Math.sin(theta) * ry).toFixed(1)})`
                          : undefined
                      }
                    >
                      {reduced ? null : (
                        <animateMotion
                          dur={`${dur.toFixed(2)}s`}
                          begin={`${((-(j / moons.length) * dur).toFixed(2))}s`}
                          repeatCount="indefinite"
                          path={moonPath(m.rx)}
                        />
                      )}
                      <title>{m.name}</title>
                      <circle className="moon-dot" r={m.r} fill={`url(#mskin-${p.name}-${m.name})`} />
                    </g>
                  </g>
                );
              })}
              <text y={p.r + 15} textAnchor="middle" className="planet-name">
                {p.name}
              </text>
            </g>
          );
        })}

        {/* Sun paints last so orbit crossings slide behind it. */}
        <g
          className="sun-rays"
          stroke="#ffce7a"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        >
          {RAYS.map((deg) => (
            <line
              key={deg}
              x1={SUN_X + 34}
              y1={CY}
              x2={SUN_X + 58}
              y2={CY}
              transform={`rotate(${deg} ${SUN_X} ${CY})`}
            />
          ))}
        </g>
        <circle className="sun-glow" cx={SUN_X} cy={CY} r="52" fill="url(#sunGlow)" opacity="0.9" />
        <circle cx={SUN_X} cy={CY} r="28" fill="url(#sunCore)" />
        <circle cx={SUN_X - 4} cy={CY - 5} r="15" fill="#fffdf4" opacity="0.85" />
        <circle cx={SUN_X - 10} cy={CY - 10} r="7" fill="#fff8dc" opacity="0.45" />
      </svg>
      {selected ? <PlanetView name={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}
