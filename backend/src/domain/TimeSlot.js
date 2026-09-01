// ---- Domain layer ----
// TimeSlot is a Value Object: two TimeSlots with the same start/end are
// interchangeable, and it carries the core booking business rule
// (overlap detection) independent of any framework or database.
// Kept dependency-free on purpose so it's trivial to unit test.

class TimeSlot {
  constructor(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new Error("Invalid start/end time");
    }
    if (start >= end) {
      throw new Error("startTime must be before endTime");
    }

    this.startTime = start;
    this.endTime = end;
  }

  isInFuture(now = new Date()) {
    return this.startTime > now;
  }

  /**
   * Two slots overlap if one starts before the other ends, in both directions.
   * Touching slots (A ends exactly when B starts) do NOT count as overlapping.
   */
  overlaps(other) {
    return this.startTime < other.endTime && other.startTime < this.endTime;
  }

  durationHours() {
    return (this.endTime - this.startTime) / (1000 * 60 * 60);
  }
}

module.exports = TimeSlot;
