/** @format */

/**
 * Test file untuk duration helper functions
 * Uncomment untuk run tests
 */

import {
  formatDuration,
  formatDurationCompact,
  parseDurationToMinutes,
  breakdownDuration,
} from "./utils";

describe("Duration Helper Functions", () => {
  describe("formatDuration", () => {
    test("should format minutes only", () => {
      expect(formatDuration(30)).toBe("30 minutes");
      expect(formatDuration(1)).toBe("1 minute");
    });

    test("should format hours", () => {
      expect(formatDuration(60)).toBe("1 hour");
      expect(formatDuration(120)).toBe("2 hours");
      expect(formatDuration(90)).toBe("1 hour 30 minutes");
    });

    test("should format days", () => {
      expect(formatDuration(1440)).toBe("1 day");
      expect(formatDuration(2880)).toBe("2 days");
      expect(formatDuration(1500)).toBe("1 day 1 hour");
      expect(formatDuration(1530)).toBe("1 day 1 hour 30 minutes");
    });

    test("should format with short option", () => {
      expect(formatDuration(90, { short: true })).toBe("1h 30m");
      expect(formatDuration(1500, { short: true })).toBe("1d 1h");
      expect(formatDuration(1530, { short: true })).toBe("1d 1h 30m");
    });

    test("should handle edge cases", () => {
      expect(formatDuration(0)).toBe("0 minutes");
      expect(formatDuration(-10)).toBe("0 minutes");
    });
  });

  describe("formatDurationCompact", () => {
    test("should format to compact form", () => {
      expect(formatDurationCompact(30)).toBe("30m");
      expect(formatDurationCompact(60)).toBe("1h");
      expect(formatDurationCompact(90)).toBe("1.5h");
      expect(formatDurationCompact(1440)).toBe("1d");
      expect(formatDurationCompact(2160)).toBe("1.5d");
    });
  });

  describe("parseDurationToMinutes", () => {
    test("should convert from different units", () => {
      expect(parseDurationToMinutes(60, "minutes")).toBe(60);
      expect(parseDurationToMinutes(2, "hours")).toBe(120);
      expect(parseDurationToMinutes(1, "days")).toBe(1440);
    });
  });

  describe("breakdownDuration", () => {
    test("should breakdown duration correctly", () => {
      expect(breakdownDuration(90)).toEqual({
        days: 0,
        hours: 1,
        minutes: 30,
        totalMinutes: 90,
      });

      expect(breakdownDuration(1500)).toEqual({
        days: 1,
        hours: 1,
        minutes: 0,
        totalMinutes: 1500,
      });

      expect(breakdownDuration(4800)).toEqual({
        days: 3,
        hours: 8,
        minutes: 0,
        totalMinutes: 4800,
      });
    });
  });
});

// Example usage console logs (for manual testing)
console.log("=== Duration Helper Examples ===");
console.log("30 minutes:", formatDuration(30));
console.log("60 minutes:", formatDuration(60));
console.log("90 minutes:", formatDuration(90));
console.log("480 minutes (8 hours):", formatDuration(480));
console.log("1440 minutes (1 day):", formatDuration(1440));
console.log("1500 minutes:", formatDuration(1500));
console.log("4800 minutes:", formatDuration(4800));
console.log("\n=== Short Format ===");
console.log("90 minutes short:", formatDuration(90, { short: true }));
console.log("1500 minutes short:", formatDuration(1500, { short: true }));
console.log("4800 minutes short:", formatDuration(4800, { short: true }));
console.log("\n=== Compact Format ===");
console.log("90 minutes compact:", formatDurationCompact(90));
console.log("1500 minutes compact:", formatDurationCompact(1500));
console.log("4800 minutes compact:", formatDurationCompact(4800));
console.log("\n=== Breakdown ===");
console.log("90 minutes breakdown:", breakdownDuration(90));
console.log("1500 minutes breakdown:", breakdownDuration(1500));
console.log("4800 minutes breakdown:", breakdownDuration(4800));
