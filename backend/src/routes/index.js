const express = require("express");
const authRoutes = require("./authRoutes");
const resourceRoutes = require("./resourceRoutes");
const bookingRoutes = require("./bookingRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/resources", resourceRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;
