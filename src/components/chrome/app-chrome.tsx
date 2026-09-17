import { Link } from "@tanstack/react-router";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LanguagePicker } from "@/components/chrome/language-picker";
import { useTheme } from "@/components/theme-provider";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { startAmbient, stopAmbient } from "@/lib/ambient";
import { useLocale } from "@/lib/i18n";
import { playSfx } from "@/lib/sfx";

export function AppChrome({ hideAuth = false }: { hideAuth?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { user, isPending } = useCurrentUserState();
  const { t } = useLocale();
  // Intent drives the button; ambient music and the unlock callback both
  // read the ref, so a stale closure can never play muted music.
  const musicIntentRef = useRef(true);
  const [musicOn, setMusicOn] = useState(true);

  useEffect(() => {
    const intent = localStorage.getItem("system-space-music") !== "false";
    musicIntentRef.current = intent;
    setMusicOn(intent);
    // Generative ambient loop (Web Audio, no file) — starts silently if
    // autoplay is blocked and begins on the first gesture.
    if (intent) startAmbient();
  }, []);

  const toggleTheme = () => {
    playSfx("click");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMusic = () => {
    // Flip the user's intent — the button always shows the truth.
    const next = !musicOn;
    playSfx("click");
    musicIntentRef.current = next;
    setMusicOn(next);
    localStorage.setItem("system-space-music", String(next));
    if (next) startAmbient();
    else stopAmbient();
  };

  const initial = (user?.displayName ?? user?.primaryEmail ?? "M").charAt(0).toUpperCase();

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-end gap-3 p-4 sm:p-5">
      <div className="pointer-events-auto flex shrink-0 items-center justify-end gap-2">
        <button
          type="button"
          className="icon-btn glass"
          onClick={toggleTheme}
          aria-pressed={theme === "light"}
          aria-label={theme === "dark" ? t.chrome.useWhite : t.chrome.useDark}
        >
          {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          <span className="hidden sm:inline">{theme === "dark" ? t.chrome.dark : t.chrome.white}</span>
        </button>

        <button
          type="button"
          className="icon-btn glass"
          onClick={toggleMusic}
          aria-pressed={musicOn}
          aria-label={musicOn ? t.chrome.muteMusic : t.chrome.playMusic}
        >
          {musicOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          <span className="hidden sm:inline">{t.chrome.music}</span>
        </button>

        <LanguagePicker />

        {hideAuth ? null : isPending ? (
          <div className="glass h-11 w-24 animate-pulse rounded-full" />
        ) : user ? (
          <Link to="/dashboard" className="icon-btn glass max-w-[12rem]">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt=""
                className="size-6 rounded-full object-cover"
              />
            ) : (
              <span className="grid size-6 place-items-center rounded-full bg-white/15 text-xs">
                {initial}
              </span>
            )}
            <span className="hidden max-w-[7rem] truncate sm:inline">
              {user.displayName ?? t.chrome.dashboard}
            </span>
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">
              {t.chrome.logIn}
            </Link>
            <Link to="/register" className="btn btn-primary">
              {t.chrome.register}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
