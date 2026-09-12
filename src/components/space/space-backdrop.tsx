import type { CSSProperties } from "react";

type Streak = {
  angle: string;
  dist: string;
  dur: string;
  delay: string;
  size: number;
};

/** Deterministic warp streaks (SSR-safe: no Math.random, never shift). */
const STREAKS: Streak[] = Array.from({ length: 110 }, (_, i) => {
  const frac = (n: number) => n - Math.floor(n);
  const a = frac(Math.sin(i * 12.9898) * 43758.5453);
  const b = frac(Math.sin(i * 78.233) * 12543.2187);
  const c = frac(Math.sin(i * 3.7) * 91.17);
  return {
    angle: `${(a * 360).toFixed(1)}deg`,
    dist: `${(30 + b * 45).toFixed(1)}vmin`,
    dur: `${(2.2 + c * 3).toFixed(2)}s`,
    delay: `${(-(a * 5)).toFixed(2)}s`,
    size: +((1.5 + b).toFixed(1)),
  };
});

function streakStyle(s: Streak): CSSProperties {
  return {
    "--a": s.angle,
    "--d": s.dist,
    width: s.size,
    height: s.size,
    animationDuration: s.dur,
    animationDelay: s.delay,
  } as CSSProperties;
}

/**
 * 3D warp background: streaks stream outward from the vanishing point
 * for a flying-through-space feel, over the themed gradient sky.
 */
export function SpaceBackdrop() {
  return (
    <div className="bd" aria-hidden="true">
      <div className="warp-field">
        {STREAKS.map((s, i) => (
          <span key={i} className="warp-star" style={streakStyle(s)} />
        ))}
      </div>
      <span className="bd-comet bd-comet-a" />
      <span className="bd-comet bd-comet-b" />
      <div className="bd-vignette" />
    </div>
  );
}
