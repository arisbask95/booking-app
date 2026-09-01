// ---- Controller layer ----
const bookingService = require("../services/bookingService");

const bookingController = {
  async create(req, res, next) {
    try {
      const booking = await bookingService.create({
        userId: req.user.id,
        resourceId: req.body.resourceId,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });
      res.status(201).json(booking);
    } catch (err) {
      next(err);
    }
  },

  async mine(req, res, next) {
    try {
      res.json(await bookingService.listForUser(req.user.id));
    } catch (err) {
      next(err);
    }
  },

  async all(req, res, next) {
    try {
      res.json(await bookingService.listAll());
    } catch (err) {
      next(err);
    }
  },

  async cancel(req, res, next) {
    try {
      const booking = await bookingService.cancel({
        bookingId: req.params.id,
        requestingUserId: req.user.id,
        requestingUserRole: req.user.role,
      });
      res.json(booking);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = bookingController;
