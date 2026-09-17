export type PlanetFacts = {
  diameterKm: number;
  distanceAu: number;
  /** Rotation period (d = days, h = hours). */
  day: string;
  /** Orbital period (d = days, y = years). */
  year: string;
  moons: number;
};

export const PLANET_FACTS: Record<string, PlanetFacts> = {
  Mercury: { diameterKm: 4879, distanceAu: 0.39, day: "59 d", year: "88 d", moons: 0 },
  Venus: { diameterKm: 12104, distanceAu: 0.72, day: "243 d", year: "225 d", moons: 0 },
  Earth: { diameterKm: 12742, distanceAu: 1.0, day: "23.9 h", year: "365.2 d", moons: 1 },
  Mars: { diameterKm: 6779, distanceAu: 1.52, day: "24.6 h", year: "687 d", moons: 2 },
  Jupiter: { diameterKm: 139820, distanceAu: 5.2, day: "9.9 h", year: "11.9 y", moons: 95 },
  Saturn: { diameterKm: 116460, distanceAu: 9.58, day: "10.7 h", year: "29.4 y", moons: 146 },
  Uranus: { diameterKm: 50724, distanceAu: 19.2, day: "17.2 h", year: "84 y", moons: 28 },
  Neptune: { diameterKm: 49244, distanceAu: 30.1, day: "16.1 h", year: "164.8 y", moons: 16 },
};
