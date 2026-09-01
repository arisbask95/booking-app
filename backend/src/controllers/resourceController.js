// ---- Controller layer ----
const resourceService = require("../services/resourceService");

const resourceController = {
  async list(req, res, next) {
    try {
      res.json(await resourceService.listAll());
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      res.json(await resourceService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      res.status(201).json(await resourceService.create(req.body));
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      res.json(await resourceService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await resourceService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async availability(req, res, next) {
    try {
      const date = req.query.date || new Date().toISOString().slice(0, 10);
      res.json(await resourceService.availabilityForDay(req.params.id, date));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = resourceController;
