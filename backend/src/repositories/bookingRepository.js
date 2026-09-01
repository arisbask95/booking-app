// ---- Repository layer ----
const prisma = require("../config/db");

const bookingRepository = {
  create(data) {
    return prisma.booking.create({
      data,
      include: { resource: true, user: { select: { id: true, name: true, email: true } } },
    });
  },

  findById(id) {
    return prisma.booking.findUnique({
      where: { id },
      include: { resource: true, user: { select: { id: true, name: true, email: true } } },
    });
  },

  findByUser(userId) {
    return prisma.booking.findMany({
      where: { userId },
      include: { resource: true },
      orderBy: { startTime: "desc" },
    });
  },

  findAll() {
    return prisma.booking.findMany({
      include: { resource: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { startTime: "desc" },
    });
  },

  // Active (not cancelled) bookings for a resource that could possibly overlap
  // a given range — used by the service layer's overlap check.
  findActiveByResourceInRange(resourceId, rangeStart, rangeEnd) {
    return prisma.booking.findMany({
      where: {
        resourceId,
        status: { in: ["PENDING", "CONFIRMED"] },
        startTime: { lt: rangeEnd },
        endTime: { gt: rangeStart },
      },
    });
  },

  updateStatus(id, status) {
    return prisma.booking.update({ where: { id }, data: { status } });
  },
};

module.exports = bookingRepository;
