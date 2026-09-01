// Pure unit tests for the core domain rule — no DB, no network, fast.
const TimeSlot = require("../src/domain/TimeSlot");

describe("TimeSlot", () => {
  test("throws when start is after end", () => {
    expect(() => new TimeSlot("2030-01-01T10:00:00Z", "2030-01-01T09:00:00Z")).toThrow();
  });

  test("throws when start equals end", () => {
    expect(() => new TimeSlot("2030-01-01T10:00:00Z", "2030-01-01T10:00:00Z")).toThrow();
  });

  test("detects overlapping slots", () => {
    const a = new TimeSlot("2030-01-01T10:00:00Z", "2030-01-01T12:00:00Z");
    const b = new TimeSlot("2030-01-01T11:00:00Z", "2030-01-01T13:00:00Z");
    expect(a.overlaps(b)).toBe(true);
    expect(b.overlaps(a)).toBe(true);
  });

  test("does not flag back-to-back slots as overlapping", () => {
    const a = new TimeSlot("2030-01-01T10:00:00Z", "2030-01-01T11:00:00Z");
    const b = new TimeSlot("2030-01-01T11:00:00Z", "2030-01-01T12:00:00Z");
    expect(a.overlaps(b)).toBe(false);
  });

  test("does not flag clearly separate slots as overlapping", () => {
    const a = new TimeSlot("2030-01-01T10:00:00Z", "2030-01-01T11:00:00Z");
    const b = new TimeSlot("2030-01-01T14:00:00Z", "2030-01-01T15:00:00Z");
    expect(a.overlaps(b)).toBe(false);
  });

  test("isInFuture reflects a reference 'now'", () => {
    const slot = new TimeSlot("2030-01-01T10:00:00Z", "2030-01-01T11:00:00Z");
    expect(slot.isInFuture(new Date("2020-01-01"))).toBe(true);
    expect(slot.isInFuture(new Date("2031-01-01"))).toBe(false);
  });

  test("durationHours computes correctly", () => {
    const slot = new TimeSlot("2030-01-01T10:00:00Z", "2030-01-01T12:30:00Z");
    expect(slot.durationHours()).toBe(2.5);
  });
});
