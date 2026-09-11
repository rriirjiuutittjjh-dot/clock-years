import { Link } from "@tanstack/react-router";
import {
  Lightbulb,
  LightbulbOff,
  Pause,
  Play,
  Sparkle,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export function AppChrome({ hideAuth = false }: { hideAuth?: boolean }) {
  const { lights, setLights, space, setSpace, motion, setMotion } = useTheme();
  const { user, isPending } = useCurrentUserState();
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
          onClick={() => setLights(lights === "on" ? "off" : "on")}
          aria-pressed={lights === "on"}
          aria-label={lights === "on" ? "Turn lights off" : "Turn lights on"}
        >
          {lights === "on" ? <Lightbulb className="size-4" /> : <LightbulbOff className="size-4" />}
          <span className="hidden sm:inline">Lights {lights === "on" ? "on" : "off"}</span>
        </button>

        <button
          type="button"
          className="icon-btn glass"
          onClick={() => setSpace(space === "on" ? "off" : "on")}
          aria-pressed={space === "on"}
          aria-label={space === "on" ? "Turn space off" : "Turn space on"}
        >
          {space === "on" ? <Sparkles className="size-4" /> : <Sparkle className="size-4" />}
          <span className="hidden sm:inline">Space {space === "on" ? "on" : "off"}</span>
        </button>

        <button
          type="button"
          className="icon-btn glass"
          onClick={() => setMotion(motion === "on" ? "off" : "on")}
          aria-pressed={motion === "on"}
          aria-label={motion === "on" ? "Turn motion off" : "Turn motion on"}
        >
          {motion === "on" ? <Pause className="size-4" /> : <Play className="size-4" />}
          <span className="hidden sm:inline">Motion {motion === "on" ? "on" : "off"}</span>
        </button>

        <button
          type="button"
          className="icon-btn glass"
          onClick={toggleMusic}
          aria-pressed={musicOn}
          aria-label={musicOn ? "Mute music" : "Play music"}
        >
          {musicOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          <span className="hidden sm:inline">Music</span>
        </button>

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
              {user.displayName ?? "Dashboard"}
            </span>
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
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
