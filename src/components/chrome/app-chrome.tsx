import { Link } from "@tanstack/react-router";
import { Sparkle, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LanguagePicker } from "@/components/chrome/language-picker";
import { useTheme } from "@/components/theme-provider";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AppChrome({ hideAuth = false }: { hideAuth?: boolean }) {
  const { space, setSpace, setMotion } = useTheme();
  const { user, isPending } = useCurrentUserState();
  const { t } = useLocale();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicOn, setMusicOn] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const stored = localStorage.getItem("system-space-music");
    if (stored === "false") {
      audio.pause();
      setMusicOn(false);
      return;
    }
    audio.play().catch(() => {
      const unlock = () => {
        void audio.play();
        window.removeEventListener("pointerdown", unlock);
      };
      window.addEventListener("pointerdown", unlock, { once: true });
    });
  }, []);

  const toggleSpace = () => {
    const next = space === "on" ? "off" : "on";
    setSpace(next);
    setMotion(next);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      localStorage.setItem("system-space-music", "true");
      setMusicOn(true);
    } else {
      audio.pause();
      localStorage.setItem("system-space-music", "false");
      setMusicOn(false);
    }
  };

  const initial = (user?.displayName ?? user?.primaryEmail ?? "M").charAt(0).toUpperCase();

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 sm:p-5">
      <Link to="/" className={cn("brand-pill glass pointer-events-auto")}>
        System Space
      </Link>

      <div className="pointer-events-auto flex shrink-0 items-center justify-end gap-2">
        <button
          type="button"
          className="icon-btn glass"
          onClick={toggleSpace}
          aria-pressed={space === "on"}
          aria-label={space === "on" ? t.chrome.turnSpaceOff : t.chrome.turnSpaceOn}
        >
          {space === "on" ? <Sparkles className="size-4" /> : <Sparkle className="size-4" />}
          <span className="hidden sm:inline">{space === "on" ? t.chrome.spaceOn : t.chrome.spaceOff}</span>
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

      <audio ref={audioRef} loop>
        <source src="/background.mp3" type="audio/mpeg" />
      </audio>
    </header>
  );
}
