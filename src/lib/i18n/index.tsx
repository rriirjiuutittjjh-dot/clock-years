import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en } from "./locales/en";

/**
 * App locales. English ships first; adding a language is:
 * 1. Add `src/lib/i18n/locales/<tag>.ts` exporting a `Dictionary`.
 * 2. Register it in `LOCALES`, `dictionaries`, and `DIRS` below.
 * 3. Add a switcher UI calling `setLocale()` (none while only "en" exists).
 *
 * `Dictionary` is the shape of the English copy, so a new locale with a
 * missing or mistyped key fails `npm run typecheck` instead of rendering
 * blank. Interpolated strings are functions so each language owns its own
 * word order, pluralization, and number formatting.
 */
export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en };
const DIRS: Record<Locale, "ltr" | "rtl"> = { en: "ltr" };

const STORAGE_KEY = "system-space-locale";

type LocaleCtx = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** The active dictionary — `t.home.previewFinale`, `t.auth.email`, … */
  t: Dictionary;
};

const LocaleContext = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (LOCALES as readonly string[]).includes(stored)) {
      setLocaleState(stored as Locale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = DIRS[locale];
  }, [locale]);

  const value = useMemo<LocaleCtx>(
    () => ({
      locale,
      setLocale: (next) => {
        if (!(LOCALES as readonly string[]).includes(next)) return;
        setLocaleState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
      t: dictionaries[locale],
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleCtx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
