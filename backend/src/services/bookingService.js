// ---- Service layer ----
// Owns the core domain rule: no overlapping active bookings per resource.
const bookingRepository = require("../repositories/bookingRepository");
const resourceRepository = require("../repositories/resourceRepository");
const TimeSlot = require("../domain/TimeSlot");

const bookingService = {
  async create({ userId, resourceId, startTime, endTime }) {
    const resource = await resourceRepository.findById(resourceId);
    if (!resource) {
      throw Object.assign(new Error("resource not found"), { status: 404 });
    }

    const slot = new TimeSlot(startTime, endTime); // throws if invalid range
    if (!slot.isInFuture()) {
      throw Object.assign(new Error("cannot book a slot in the past"), { status: 400 });
    }

    const conflicting = await bookingRepository.findActiveByResourceInRange(
      resourceId,
      slot.startTime,
      slot.endTime
    );
    if (conflicting.length > 0) {
      throw Object.assign(
        new Error("resource is already booked for part of that time range"),
        { status: 409 }
      );
    }

    return bookingRepository.create({
      userId,
      resourceId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "CONFIRMED",
    });
  },

  listForUser(userId) {
    return bookingRepository.findByUser(userId);
  },

  listAll() {
    return bookingRepository.findAll();
  },

  async cancel({ bookingId, requestingUserId, requestingUserRole }) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw Object.assign(new Error("booking not found"), { status: 404 });

    const isOwner = booking.userId === requestingUserId;
    const isAdmin = requestingUserRole === "ADMIN";
    if (!isOwner && !isAdmin) {
      throw Object.assign(new Error("not allowed to cancel this booking"), { status: 403 });
    }
    if (booking.status === "CANCELLED") {
      throw Object.assign(new Error("booking is already cancelled"), { status: 400 });
    }

    return bookingRepository.updateStatus(bookingId, "CANCELLED");
  },
};

module.exports = bookingService;
