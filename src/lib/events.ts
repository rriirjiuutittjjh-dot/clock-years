/**
 * Secondary countdown targets — dates worth watching besides New Year.
 * Add an entry here and both the home page and the member dashboard pick
 * it up automatically.
 */
export type ScheduledEvent = {
  id: string;
  /** Brand name, kept verbatim in every locale. */
  title: string;
  /** The release moment, in the visitor's local time. */
  target: Date;
};

/** Grand Theft Auto VI is officially set to release on November 19, 2026. */
export const GTA_VI_RELEASE: ScheduledEvent = {
  id: "gta-vi",
  title: "Grand Theft Auto VI",
  target: new Date(2026, 10, 19),
};

export const EVENTS: readonly ScheduledEvent[] = [GTA_VI_RELEASE];

/** How long a released event keeps its card ("Out now") before dropping off. */
const OUT_NOW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * The event to feature right now: the soonest one that has not happened yet,
 * or that happened within the out-now window. Null once every event is long
 * past, so the card quietly disappears instead of counting negative.
 */
export function currentEvent(from: Date): ScheduledEvent | null {
  const now = from.getTime();
  let best: ScheduledEvent | null = null;
  for (const event of EVENTS) {
    if (event.target.getTime() + OUT_NOW_WINDOW_MS <= now) continue;
    if (!best || event.target.getTime() < best.target.getTime()) best = event;
  }
  return best;
}
