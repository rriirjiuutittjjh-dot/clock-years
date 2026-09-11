import { useCallback, useEffect, useRef, useState } from "react";
import { AppChrome } from "@/components/chrome/app-chrome";
import { CountdownClock } from "@/components/space/countdown-clock";
import { Fireworks } from "@/components/space/fireworks";
import { SolarSystem } from "@/components/space/solar-system";
import { SpaceStage } from "@/components/space/space-stage";
import {
  formatMeta,
  formatNow,
  formatTarget,
  nextNewYear,
  pad2,
  splitMs,
  yearProgress,
} from "@/lib/countdown";

export function HomeView() {
  const targetRef = useRef(new Date(0));
  const partyTimer = useRef<number | null>(null);
  const partyStarted = useRef(false);
  const lastSecond = useRef<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetLabel, setTargetLabel] = useState("January 1");
  const [meta, setMeta] = useState("");
  const [clockNow, setClockNow] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [party, setParty] = useState(false);
  const [partySub, setPartySub] = useState("");
  const [trueMidnight, setTrueMidnight] = useState(false);
  const [nextYearLabel, setNextYearLabel] = useState("");
  const [fx, setFx] = useState(false);
  const [sr, setSr] = useState("");
  const [readyMs, setReadyMs] = useState<number | null>(null);

  const describe = useCallback(() => {
    setTargetLabel(formatTarget(targetRef.current));
    setMeta(formatMeta(targetRef.current));
  }, []);

  const startParty = useCallback((year: number) => {
    setParty(true);
    setFx(true);
    setTrueMidnight(true);
    setPartySub("Here we go.");
    setNextYearLabel(String(year + 1));
    const midnight = new Date(year, 0, 1).getTime();
    if (partyTimer.current) window.clearInterval(partyTimer.current);
    partyTimer.current = window.setInterval(() => {
      const s = splitMs(Date.now() - midnight);
      setPartySub(`${pad2(s.hours)}h ${pad2(s.minutes)}m ${pad2(s.seconds)}s of ${year} so far`);
    }, 1000);
  }, []);

  useEffect(() => {
    setMounted(true);
    targetRef.current = nextNewYear(new Date());
    describe();

    const tick = () => {
      const now = new Date();
      const remaining = targetRef.current.getTime() - now.getTime();
      if (remaining <= 0) {
        if (!partyStarted.current) {
          partyStarted.current = true;
          startParty(targetRef.current.getFullYear());
        }
        return;
      }
      const p = splitMs(remaining);
      const stamp = Math.ceil(remaining / 1000);
      if (stamp !== lastSecond.current) {
        lastSecond.current = stamp;
        setParts(p);
        const pct = yearProgress(now);
        setProgress(pct);
        setProgressLabel(`${now.getFullYear()} is ${pct.toFixed(2)}% complete`);
        setClockNow(formatNow(now));
        if (p.seconds === 0) {
          setSr(
            `${p.days} days, ${p.hours} hours and ${p.minutes} minutes until ${targetRef.current.getFullYear()}`,
          );
        }
        document.title = `${p.days}d ${pad2(p.hours)}:${pad2(p.minutes)}:${pad2(p.seconds)} · System Space`;
      }
    };

    tick();
    // Page-load timer: ms from navigation start to the first live tick.
    setReadyMs(Math.round(window.performance.now()));
    const interval = window.setInterval(tick, 250);
    return () => {
      window.clearInterval(interval);
      if (partyTimer.current) window.clearInterval(partyTimer.current);
    };
  }, [describe, startParty]);

  const onPreview = () => {
    setParty(true);
    setFx(true);
    setTrueMidnight(false);
    setPartySub("A sneak peek of midnight.");
    window.setTimeout(() => {
      if (!partyStarted.current) {
        setParty(false);
        setFx(false);
      }
    }, 6500);
  };

  const onNext = () => {
    if (partyTimer.current) window.clearInterval(partyTimer.current);
    partyStarted.current = false;
    targetRef.current = nextNewYear(new Date());
    lastSecond.current = null;
    describe();
    setParty(false);
    setFx(false);
    setTrueMidnight(false);
  };

  return (
    <SpaceStage>
      <AppChrome />
      {fx ? <Fireworks active={fx} /> : null}

      <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center px-4 pb-16 pt-24 text-center">
        <SolarSystem />

        <div className={`mt-6 w-full transition-opacity duration-300 ${party ? "opacity-0" : "opacity-100"}`}>
          {mounted ? <CountdownClock parts={parts} /> : <CountdownClock parts={{ days: 0, hours: 0, minutes: 0, seconds: 0 }} />}

          <p className="mt-8 text-sm text-muted">
            Target: <strong className="font-medium text-ink">{targetLabel}</strong>
          </p>

          <div className="mx-auto mt-6 w-full max-w-md">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress.toFixed(3)}%`,
                  background: "linear-gradient(90deg, var(--color-ice), #e8e2ff, var(--color-sun))",
                }}
              />
            </div>
            <p className="mt-3 text-xs tracking-wide text-muted">{progressLabel}</p>
          </div>

          <div className="mt-6 space-y-2 text-xs tracking-wide text-muted">
            <p>{meta}</p>
            <p>{clockNow ? `Now: ${clockNow}` : ""}</p>
            {readyMs !== null ? <p>Loaded in {(readyMs / 1000).toFixed(1)}s</p> : null}
          </div>

          {!partyStarted.current ? (
            <button type="button" className="btn btn-ghost mt-6" onClick={onPreview}>
              Preview the finale
            </button>
          ) : null}
        </div>
      </main>

      {party ? (
        <div className="celebrate">
          <h1>Happy New Year</h1>
          <p>Here is to a brilliant year ahead.</p>
          <p className="text-sm text-muted">{partySub}</p>
          {trueMidnight ? (
            <button type="button" className="btn btn-ghost" onClick={onNext}>
              Start counting to {nextYearLabel}
            </button>
          ) : null}
        </div>
      ) : null}

      <p className="sr-only" role="status" aria-live="polite">
        {sr}
      </p>
    </SpaceStage>
  );
}
