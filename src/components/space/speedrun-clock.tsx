import { useEffect, useRef, useState } from "react";
import { formatNow, formatStopwatch } from "@/lib/countdown";
import { useLocale } from "@/lib/i18n";

export function SpeedrunPanel() {
  const { t, locale } = useLocale();
  const [time, setTime] = useState(() => formatNow(new Date(), locale));
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const accRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatNow(new Date(), locale)), 250);
    return () => window.clearInterval(id);
  }, [locale]);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    let raf = 0;
    const frame = () => {
      setElapsed(accRef.current + (performance.now() - startRef.current));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      accRef.current += performance.now() - startRef.current;
      setElapsed(accRef.current);
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    accRef.current = 0;
    setElapsed(0);
  };

  return (
    <section className="glass mx-auto mt-8 w-full max-w-md rounded-[28px] p-6 text-center">
      <h2 className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
        {t.home.clockTitle}
      </h2>
      <p className="num mt-2 text-5xl tabular-nums" role="timer" aria-label={time}>
        {time}
      </p>

      <div className="mx-auto mt-6 h-px max-w-xs bg-white/10" aria-hidden="true" />

      <h2 className="mt-6 text-xs font-medium tracking-[0.2em] text-muted uppercase">
        {t.home.stopwatchTitle}
      </h2>
      {/* No live region: millisecond digits update every frame. */}
      <p className="num mt-2 text-3xl tabular-nums sm:text-4xl" aria-hidden="true">
        {formatStopwatch(elapsed)}
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setRunning((r) => !r)}
          aria-pressed={running}
        >
          {running ? t.home.pause : elapsed > 0 ? t.home.resume : t.home.start}
        </button>
        <button type="button" className="btn btn-ghost" onClick={reset}>
          {t.home.reset}
        </button>
      </div>
    </section>
  );
}
