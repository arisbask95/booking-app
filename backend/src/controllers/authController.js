// ---- Controller layer ----
// Thin: parse request, call service, shape response. No business logic here.
const authService = require("../services/authService");

const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await authService.me(req.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
