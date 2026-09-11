const STARS = Array.from({ length: 72 }, (_, i) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  const t = s - Math.floor(s);
  const u = Math.sin(i * 78.233) * 23421.631;
  const v = u - Math.floor(u);
  const w = Math.sin(i * 3.7) * 91.17;
  const p = w - Math.floor(w);
  return {
    left: `${(t * 100).toFixed(2)}%`,
    top: `${(v * 100).toFixed(2)}%`,
    dim: i % 3 !== 0,
    pulse: i % 11 === 0,
    delay: `${(p * 3).toFixed(2)}s`,
  };
});

export function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {STARS.map((star, i) => (
        <span
          key={i}
          className={`star${star.dim ? " dim" : ""}${star.pulse ? " pulse" : ""}`}
          style={{ left: star.left, top: star.top, animationDelay: star.delay }}
        />
      ))}
    </div>
  );
}
