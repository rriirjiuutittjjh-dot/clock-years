export function AuthArt({ title }: { title: string }) {
  return (
    <div className="relative hidden min-h-[280px] overflow-hidden lg:block">
      <svg viewBox="0 0 640 720" className="h-full w-full" role="img" aria-hidden="true">
        <title>{title}</title>
        <defs>
          <radialGradient id="authSun" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff4c8" />
            <stop offset="55%" stopColor="#f0d48a" />
            <stop offset="100%" stopColor="#d7a24a" />
          </radialGradient>
          <linearGradient id="hull" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ece8ff" />
            <stop offset="100%" stopColor="#8f86c4" />
          </linearGradient>
        </defs>
        <rect width="640" height="720" fill="#0c0620" />
        <circle cx="120" cy="90" r="1.4" fill="#fff" opacity="0.7" />
        <circle cx="280" cy="48" r="1.2" fill="#fff" opacity="0.5" />
        <circle cx="420" cy="120" r="1.6" fill="#fff" opacity="0.8" />
        <circle cx="520" cy="70" r="1.1" fill="#fff" opacity="0.45" />
        <circle cx="80" cy="240" r="1.3" fill="#fff" opacity="0.55" />
        <circle cx="560" cy="260" r="1.5" fill="#fff" opacity="0.6" />
        <circle cx="200" cy="320" r="1" fill="#fff" opacity="0.4" />
        <circle cx="490" cy="400" r="1.2" fill="#fff" opacity="0.5" />
        <circle cx="90" cy="500" r="1.4" fill="#fff" opacity="0.45" />
        <circle cx="610" cy="560" r="1.1" fill="#fff" opacity="0.4" />

        <ellipse cx="320" cy="360" rx="250" ry="250" fill="none" stroke="rgba(232,226,255,0.12)" />
        <ellipse cx="320" cy="360" rx="180" ry="180" fill="none" stroke="rgba(232,226,255,0.1)" />
        <ellipse cx="320" cy="360" rx="110" ry="110" fill="none" stroke="rgba(232,226,255,0.1)" />

        <circle cx="168" cy="210" r="46" fill="url(#authSun)" />
        <circle cx="154" cy="196" r="10" fill="#fff8dc" opacity="0.4" />

        <circle cx="300" cy="248" r="10" fill="#b7a48c" />
        <circle cx="352" cy="268" r="14" fill="#e2c07a" />
        <circle cx="410" cy="300" r="16" fill="#4f8fce" />
        <circle cx="402" cy="296" r="5" fill="#3d8a62" />
        <circle cx="468" cy="348" r="11" fill="#c45c3e" />
        <circle cx="520" cy="430" r="28" fill="#d9a066" />
        <ellipse cx="520" cy="430" rx="22" ry="5" fill="#c9844c" opacity="0.5" />

        <g transform="translate(240 470)">
          <ellipse cx="90" cy="38" rx="70" ry="10" fill="#7eb8e8" opacity="0.18" />
          <path
            d="M18 28 L92 8 L162 30 L132 42 L92 36 L48 44 Z"
            fill="url(#hull)"
          />
          <path d="M92 8 L108 28 L92 24 L76 28 Z" fill="#f0d48a" />
          <circle cx="70" cy="28" r="5" fill="#1b1238" />
          <circle cx="70" cy="28" r="2.4" fill="#7eb8e8" />
          <circle cx="108" cy="29" r="5" fill="#1b1238" />
          <circle cx="108" cy="29" r="2.4" fill="#7eb8e8" />
        </g>
      </svg>
    </div>
  );
}

export function DashboardMark() {
  return (
    <svg viewBox="0 0 72 72" className="size-12" aria-hidden="true">
      <circle cx="36" cy="36" r="34" fill="#1a0b3d" />
      <circle cx="22" cy="28" r="10" fill="#f0d48a" />
      <circle cx="42" cy="34" r="4" fill="#4f8fce" />
      <circle cx="52" cy="40" r="6" fill="#d9a066" />
      <ellipse cx="52" cy="40" rx="10" ry="3" fill="none" stroke="#e6d3a3" strokeWidth="1.4" />
    </svg>
  );
}
