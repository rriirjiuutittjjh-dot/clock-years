export const UNITS = ["days", "hours", "minutes", "seconds"] as const;
export type Unit = (typeof UNITS)[number];

export const UNIT_LABELS: Record<Unit, string> = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

export function nextNewYear(from: Date) {
  return new Date(from.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
}

export function splitMs(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total / 3600) % 24),
    minutes: Math.floor((total / 60) % 60),
    seconds: total % 60,
  };
}

export function yearProgress(now: Date) {
  const start = new Date(now.getFullYear(), 0, 1).getTime();
  const end = new Date(now.getFullYear() + 1, 0, 1).getTime();
  return ((now.getTime() - start) / (end - start)) * 100;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatTarget(target: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(target);
}

export function formatMeta(target: Date) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "local time";
  const when = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(target);
  return `Rings in ${when} · ${tz}`;
}

export function formatNow(now: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);
}
