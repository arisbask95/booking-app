// ---- Service layer ----
const resourceRepository = require("../repositories/resourceRepository");
const bookingRepository = require("../repositories/bookingRepository");
const TimeSlot = require("../domain/TimeSlot");

const resourceService = {
  listAll() {
    return resourceRepository.findAll();
  },

  async getById(id) {
    const resource = await resourceRepository.findById(id);
    if (!resource) throw Object.assign(new Error("resource not found"), { status: 404 });
    return resource;
  },

  create(data) {
    if (!data.name) {
      throw Object.assign(new Error("name is required"), { status: 400 });
    }
    return resourceRepository.create({
      name: data.name,
      description: data.description || null,
      location: data.location || null,
      capacity: data.capacity ? Number(data.capacity) : 1,
      pricePerHour: data.pricePerHour ? Number(data.pricePerHour) : 0,
    });
  },

  async update(id, data) {
    await resourceService.getById(id); // 404s if missing
    return resourceRepository.update(id, data);
  },

  async delete(id) {
    await resourceService.getById(id);
    return resourceRepository.delete(id);
  },

  /**
   * Naive availability check for a given day: returns the list of
   * existing bookings for that resource/day so the frontend can render
   * which hours are taken. (Kept simple on purpose for the prototype.)
   */
  async availabilityForDay(resourceId, dateStr) {
    await resourceService.getById(resourceId);
    const dayStart = new Date(dateStr);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const slot = new TimeSlot(dayStart, dayEnd);
    const bookings = await bookingRepository.findActiveByResourceInRange(
      resourceId,
      slot.startTime,
      slot.endTime
    );
    return bookings.map((b) => ({ startTime: b.startTime, endTime: b.endTime, status: b.status }));
  },
};

module.exports = resourceService;
