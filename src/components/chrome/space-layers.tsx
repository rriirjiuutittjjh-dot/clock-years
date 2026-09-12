import { Check, ChevronDown, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { useLocale } from "@/lib/i18n";

export function SpaceLayersMenu() {
  const { layers, setLayer } = useTheme();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const rows = [
    { key: "orbits", label: t.layers.orbits },
    { key: "moons", label: t.planet.moons },
    { key: "labels", label: t.layers.labels },
  ] as const;

  return (
    <div className="lang-picker" ref={rootRef}>
      <button
        type="button"
        className="icon-btn glass"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.layers.title}
        onClick={() => setOpen((o) => !o)}
      >
        <Layers className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t.layers.title}</span>
        <ChevronDown className="size-4 opacity-70" aria-hidden="true" />
      </button>

      {open ? (
        <ul className="lang-menu glass" role="menu" aria-label={t.layers.title}>
          {rows.map((r) => (
            <li key={r.key} role="none">
              <button
                type="button"
                role="menuitemcheckbox"
                aria-checked={layers[r.key]}
                className={`lang-option${layers[r.key] ? " current" : ""}`}
                onClick={() => setLayer(r.key, !layers[r.key])}
              >
                <span>{r.label}</span>
                {layers[r.key] ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
