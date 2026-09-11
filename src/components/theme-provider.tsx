import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getPublicSettings } from "@/lib/server/site";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/types";
import { hexToRgb } from "@/lib/utils";

type ThemeCtx = {
  settings: SiteSettings;
  lights: "on" | "off";
  setLights: (next: "on" | "off") => void;
  space: "on" | "off";
  setSpace: (next: "on" | "off") => void;
  refreshSettings: () => Promise<void>;
  applySettings: (next: SiteSettings) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

function applyCssVars(settings: SiteSettings, lights: "on" | "off", space: "on" | "off") {
  const root = document.documentElement;
  root.dataset.lights = lights;
  root.dataset.space = space;
  root.style.setProperty("--bg-blur", `${settings.backgroundBlur}px`);
  root.style.setProperty("--glass-blur", `${settings.glassBlur}px`);
  const { r, g, b } = hexToRgb(settings.glassColor);
  root.style.setProperty("--glass-rgb", `${r}, ${g}, ${b}`);
  root.style.setProperty("--glass-alpha", String(settings.glassOpacity / 100));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [lights, setLightsState] = useState<"on" | "off">("on");
  const [space, setSpaceState] = useState<"on" | "off">("on");

  useEffect(() => {
    const storedLights = window.localStorage.getItem("system-space-lights");
    if (storedLights === "off" || storedLights === "on") setLightsState(storedLights);
    const storedSpace = window.localStorage.getItem("system-space-space");
    if (storedSpace === "off" || storedSpace === "on") setSpaceState(storedSpace);
    void getPublicSettings()
      .then(setSettings)
      .catch(() => setSettings(DEFAULT_SETTINGS));
  }, []);

  useEffect(() => {
    applyCssVars(settings, lights, space);
  }, [settings, lights, space]);

  const value = useMemo<ThemeCtx>(
    () => ({
      settings,
      lights,
      setLights: (next) => {
        setLightsState(next);
        window.localStorage.setItem("system-space-lights", next);
      },
      space,
      setSpace: (next) => {
        setSpaceState(next);
        window.localStorage.setItem("system-space-space", next);
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
    [settings, lights, space],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
