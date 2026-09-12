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

const PLANETS = [
  { name: "Mercury", r: 5.2, fill: "#b7a48c", x: 540, orbit: 0 },
  { name: "Venus", r: 8.4, fill: "#e2c07a", x: 578, orbit: 0 },
  { name: "Earth", r: 8.8, fill: "#4f8fce", x: 614, orbit: 1 },
  { name: "Mars", r: 6.4, fill: "#c45c3e", x: 646, orbit: 1 },
  { name: "Jupiter", r: 16, fill: "#d9a066", x: 684, orbit: 2 },
  { name: "Saturn", r: 13.5, fill: "#e6d3a3", x: 736, orbit: 2, rings: true },
  { name: "Uranus", r: 10, fill: "#7ec8c8", x: 778, orbit: 3 },
  { name: "Neptune", r: 9.6, fill: "#4b6fd6", x: 806, orbit: 3 },
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

const RAYS = Array.from({ length: 12 }, (_, i) => i * 30);

export function SolarSystem() {
  // SMIL motion can't be switched off from CSS, so motion-off renders the
  // classic static lineup instead of the revolving orrery.
  const { motion } = useTheme();
  const reduced = motion === "off";

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

        {PLANETS.map((p, i) => {
          const track = ORBITS[p.orbit];
          // Pair-mates start half a lap apart so they never bunch up.
          const begin = `-${((i % 2) * track.dur) / 2}s`;
          const moons = MOONS[p.name] ?? [];
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
              {moons.map((m, j) => {
                const ry = m.rx * MOON_RY;
                const dur = 4 + m.rx * 0.22;
                // Static lineup spreads moons evenly around the planet;
                // the orrery spreads them around the lap instead.
                const theta = (j / moons.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <g key={m.name}>
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={m.rx}
                      ry={ry}
                      fill="none"
                      stroke="rgba(232,226,255,0.10)"
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
                      <circle r={m.r} fill={m.fill} />
                    </g>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Sun paints last so orbit crossings slide behind it. */}
        <g
          className="sun-rays"
          stroke="#f0d48a"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.55"
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
        <circle cx={SUN_X - 10} cy={CY - 10} r="7" fill="#fff8dc" opacity="0.45" />
      </svg>
    </div>
  );
}
