const PLANETS = [
  { name: "Mercury", r: 5.2, fill: "#b7a48c", x: 268 },
  { name: "Venus", r: 8.4, fill: "#e2c07a", x: 312 },
  { name: "Earth", r: 8.8, fill: "#4f8fce", x: 358 },
  { name: "Mars", r: 6.4, fill: "#c45c3e", x: 400 },
  { name: "Jupiter", r: 16, fill: "#d9a066", x: 456 },
  { name: "Saturn", r: 13.5, fill: "#e6d3a3", x: 520, rings: true },
  { name: "Uranus", r: 10, fill: "#7ec8c8", x: 580 },
  { name: "Neptune", r: 9.6, fill: "#4b6fd6", x: 632 },
] as const;

export function SolarSystem() {
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
          <ellipse cx="450" cy="110" rx="410" ry="92" />
          <ellipse cx="450" cy="110" rx="330" ry="70" />
          <ellipse cx="450" cy="110" rx="240" ry="48" />
          <ellipse cx="450" cy="110" rx="150" ry="28" />
        </g>

        <circle cx="196" cy="110" r="52" fill="url(#sunGlow)" opacity="0.9" />
        <circle cx="196" cy="110" r="28" fill="url(#sunCore)" />
        <circle cx="186" cy="100" r="7" fill="#fff8dc" opacity="0.45" />

        {PLANETS.map((p) => (
          <g key={p.name} transform={`translate(${p.x} 110)`}>
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
        ))}
      </svg>
    </div>
  );
}
