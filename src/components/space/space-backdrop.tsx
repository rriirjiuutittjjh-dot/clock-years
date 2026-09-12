import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useTheme } from "@/components/theme-provider";

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

type Mote = {
  left: string;
  top: string;
  size: number;
  dur: string;
  delay: string;
};

/** Foreground glow dust: nearest depth plane, drifts on its own too. */
const DUST: Mote[] = Array.from({ length: 14 }, (_, i) => {
  const frac = (n: number) => n - Math.floor(n);
  const a = frac(Math.sin(i * 45.32 + 7.7) * 23456.789);
  const b = frac(Math.sin(i * 91.7 + 3.1) * 12345.678);
  return {
    left: `${(a * 100).toFixed(2)}%`,
    top: `${(b * 100).toFixed(2)}%`,
    size: +((2 + a * 2.5).toFixed(1)),
    dur: `${(5 + b * 6).toFixed(2)}s`,
    delay: `${(-(a * 8)).toFixed(2)}s`,
  };
});

/**
 * 4D system-space background: warp streaks + nebula orbs + glow dust,
 * each depth plane trailing the mouse with smooth inertia (3D space
 * plus motion over time). Fades with space off, stills with motion off.
 */
export function SpaceBackdrop() {
  const { motion } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || motion === "off") {
      el?.style.setProperty("--mx", "0");
      el?.style.setProperty("--my", "0");
      return;
    }
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.setProperty("--mx", cx.toFixed(3));
      el.style.setProperty("--my", cy.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [motion]);

  return (
    <div ref={ref} className="bd" aria-hidden="true">
      <div className="neb-wrap">
        <div className="neb neb-a" />
        <div className="neb neb-b" />
        <div className="neb neb-c" />
      </div>
      <div className="warp-field">
        {STREAKS.map((s, i) => (
          <span
            key={i}
            className="warp-star"
            style={{
              "--a": s.angle,
              "--d": s.dist,
              width: s.size,
              height: s.size,
              animationDuration: s.dur,
              animationDelay: s.delay,
            } as CSSProperties}
          />
        ))}
      </div>
      <div className="dust-wrap">
        {DUST.map((d, i) => (
          <span
            key={i}
            className="dust"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              animationDuration: d.dur,
              animationDelay: d.delay,
            }}
          />
        ))}
      </div>
      <span className="bd-comet bd-comet-a" />
      <span className="bd-comet bd-comet-b" />
      <div className="bd-vignette" />
    </div>
  );
}
