import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getPublicSettings } from "@/lib/server/site";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/types";
import { hexToRgb } from "@/lib/utils";

type ThemeCtx = {
  settings: SiteSettings;
  space: "on" | "off";
  setSpace: (next: "on" | "off") => void;
  motion: "on" | "off";
  setMotion: (next: "on" | "off") => void;
  refreshSettings: () => Promise<void>;
  applySettings: (next: SiteSettings) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

function applyCssVars(
  settings: SiteSettings,
  space: "on" | "off",
  motion: "on" | "off",
) {
  const root = document.documentElement;
  root.dataset.space = space;
  root.dataset.motion = motion;
  root.style.setProperty("--bg-blur", `${settings.backgroundBlur}px`);
  root.style.setProperty("--glass-blur", `${settings.glassBlur}px`);
  const { r, g, b } = hexToRgb(settings.glassColor);
  root.style.setProperty("--glass-rgb", `${r}, ${g}, ${b}`);
  root.style.setProperty("--glass-alpha", String(settings.glassOpacity / 100));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [space, setSpaceState] = useState<"on" | "off">("on");
  const [motion, setMotionState] = useState<"on" | "off">("on");

  useEffect(() => {
    window.localStorage.removeItem("system-space-lights");
    const storedSpace = window.localStorage.getItem("system-space-space");
    if (storedSpace === "off" || storedSpace === "on") setSpaceState(storedSpace);
    const storedMotion = window.localStorage.getItem("system-space-motion");
    if (storedMotion === "off" || storedMotion === "on") {
      setMotionState(storedMotion);
    } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotionState("off");
    }
    void getPublicSettings()
      .then(setSettings)
      .catch(() => setSettings(DEFAULT_SETTINGS));
  }, []);

  useEffect(() => {
    applyCssVars(settings, space, motion);
  }, [settings, space, motion]);

  const value = useMemo<ThemeCtx>(
    () => ({
      settings,
      space,
      setSpace: (next) => {
        setSpaceState(next);
        window.localStorage.setItem("system-space-space", next);
      },
      motion,
      setMotion: (next) => {
        setMotionState(next);
        window.localStorage.setItem("system-space-motion", next);
      },
      refreshSettings: async () => {
        try {
          setSettings(await getPublicSettings());
        } catch {
          /* keep current */
        }
      },
      applySettings: setSettings,
    }),
    [settings, space, motion],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
