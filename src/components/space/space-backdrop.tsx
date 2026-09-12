import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useTheme } from "@/components/theme-provider";

type Dot = {
  left: string;
  top: string;
  size: number;
  glow: boolean;
  tw: boolean;
  delay: string;
  opacity: number;
};

/** Deterministic dots (SSR-safe: no Math.random, positions never shift). */
function makeDots(count: number, seed: number, maxSize: number): Dot[] {
  return Array.from({ length: count }, (_, i) => {
    const a = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    const b = Math.sin(i * 78.233 + seed * 12.9898) * 23421.631;
    const c = Math.sin(i * 3.7 + seed * 9.17) * 91.17;
    const frac = (n: number) => n - Math.floor(n);
    const size = 1 + frac(c) * (maxSize - 1);
    return {
      left: `${(frac(a) * 100).toFixed(2)}%`,
      top: `${(frac(b) * 100).toFixed(2)}%`,
      size: +size.toFixed(1),
      glow: size > maxSize * 0.72,
      tw: i % 9 === 0,
      delay: `${(frac(c) * 3.6).toFixed(2)}s`,
      opacity: +((0.35 + frac(a) * 0.65).toFixed(2)),
    };
  });
}

const FAR = makeDots(90, 1, 1.6);
const MID = makeDots(60, 2, 2.4);
const NEAR = makeDots(28, 3, 3.4);

function DotField({ dots }: { dots: Dot[] }) {
  return (
    <>
      {dots.map((d, i) => (
        <span
          key={i}
          className={`bd-star${d.glow ? " glow" : ""}${d.tw ? " tw" : ""}`}
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDelay: d.delay,
          }}
        />
      ))}
    </>
  );
}

function depthVar(depth: number): CSSProperties {
  return { "--depth": depth } as CSSProperties;
}

/**
 * 3D space backdrop: nebula clouds plus three star layers drifting at
 * different speeds and shifting with the pointer for real depth.
 * Honors the Space on/off toggle (via .space-bg) and motion-off.
 */
export function SpaceBackdrop() {
  const { motion } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || motion === "off") {
      el?.style.setProperty("--px", "0");
      el?.style.setProperty("--py", "0");
      return;
    }
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const node = ref.current;
        if (!node) return;
        node.style.setProperty(
          "--px",
          ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3),
        );
        node.style.setProperty(
          "--py",
          ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3),
        );
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [motion]);

  return (
    <div ref={ref} className="bd" aria-hidden="true">
      <div className="bd-layer" style={depthVar(6)}>
        <div className="bd-drift bd-drift-neb">
          <div className="bd-blob bd-blob-a" />
          <div className="bd-blob bd-blob-b" />
          <div className="bd-blob bd-blob-c" />
        </div>
      </div>
      <div className="bd-layer" style={depthVar(8)}>
        <div className="bd-drift bd-drift-far">
          <DotField dots={FAR} />
        </div>
      </div>
      <div className="bd-layer" style={depthVar(16)}>
        <div className="bd-drift bd-drift-mid">
          <DotField dots={MID} />
        </div>
      </div>
      <div className="bd-layer" style={depthVar(30)}>
        <div className="bd-drift bd-drift-near">
          <DotField dots={NEAR} />
        </div>
      </div>
      <span className="bd-comet bd-comet-a" />
      <span className="bd-comet bd-comet-b" />
      <div className="bd-vignette" />
    </div>
  );
}
