const express = require("express");
const resourceController = require("../controllers/resourceController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

/**
 * @openapi
 * /api/resources:
 *   get:
 *     tags: [Resources]
 *     summary: List all bookable resources
 *     responses:
 *       200: { description: Array of resources }
 *   post:
 *     tags: [Resources]
 *     summary: Create a resource (admin only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created resource }
 *       403: { description: Admin role required }
 */
router.get("/", resourceController.list);
router.post("/", requireAuth, requireRole("ADMIN"), resourceController.create);

/**
 * @openapi
 * /api/resources/{id}:
 *   get:
 *     tags: [Resources]
 *     summary: Get one resource
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Resource }
 *       404: { description: Not found }
 *   put:
 *     tags: [Resources]
 *     summary: Update a resource (admin only)
 *     security: [{ bearerAuth: [] }]
 *   delete:
 *     tags: [Resources]
 *     summary: Delete a resource (admin only)
 *     security: [{ bearerAuth: [] }]
 */
router.get("/:id", resourceController.getOne);
router.put("/:id", requireAuth, requireRole("ADMIN"), resourceController.update);
router.delete("/:id", requireAuth, requireRole("ADMIN"), resourceController.remove);

/**
 * @openapi
 * /api/resources/{id}/availability:
 *   get:
 *     tags: [Resources]
 *     summary: Get existing bookings for a resource on a given day
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *         description: Defaults to today (YYYY-MM-DD)
 *     responses:
 *       200: { description: Array of booked time slots for that day }
 */
router.get("/:id/availability", resourceController.availability);

module.exports = router;
