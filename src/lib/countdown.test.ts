import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatStopwatch, splitMs, yearProgress } from "./countdown.ts";

describe("splitMs", () => {
  it("splits days, hours, minutes, seconds", () => {
    assert.deepEqual(splitMs(90_061_000), { days: 1, hours: 1, minutes: 1, seconds: 1 });
  });

  it("clamps negatives to zero", () => {
    assert.deepEqual(splitMs(-5000), { days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("yearProgress", () => {
  it("is 0 at Jan 1 and ~100 at Dec 31", () => {
    assert.equal(yearProgress(new Date(2026, 0, 1)), 0);
    const end = yearProgress(new Date(2026, 11, 31, 23, 59, 59));
    assert.ok(end > 99.99 && end < 100);
  });
});

describe("formatStopwatch", () => {
  it("formats zero", () => {
    assert.equal(formatStopwatch(0), "00:00:00.000");
  });

  it("formats hours, minutes, seconds, millis", () => {
    assert.equal(formatStopwatch(3_661_007), "01:01:01.007");
  });

  it("clamps negatives to zero", () => {
    assert.equal(formatStopwatch(-42), "00:00:00.000");
  });
});
