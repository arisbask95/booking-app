const express = require("express");
const bookingController = require("../controllers/bookingController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

/**
 * @openapi
 * /api/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a booking for the current user
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resourceId, startTime, endTime]
 *             properties:
 *               resourceId: { type: string }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *     responses:
 *       201: { description: Booking created }
 *       409: { description: Time slot conflicts with an existing booking }
 *   get:
 *     tags: [Bookings]
 *     summary: List ALL bookings (admin only)
 *     security: [{ bearerAuth: [] }]
 */
router.post("/", requireAuth, bookingController.create);
router.get("/", requireAuth, requireRole("ADMIN"), bookingController.all);

/**
 * @openapi
 * /api/bookings/me:
 *   get:
 *     tags: [Bookings]
 *     summary: List the current user's bookings
 *     security: [{ bearerAuth: [] }]
 */
router.get("/me", requireAuth, bookingController.mine);

/**
 * @openapi
 * /api/bookings/{id}/cancel:
 *   patch:
 *     tags: [Bookings]
 *     summary: Cancel a booking (owner or admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Booking cancelled }
 *       403: { description: Not the owner and not an admin }
 */
router.patch("/:id/cancel", requireAuth, bookingController.cancel);

module.exports = router;
