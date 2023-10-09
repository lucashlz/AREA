const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/aboutController");

/**
 * @swagger
 * /about/about.json:
 *   get:
 *     summary: Get information about the server and its services.
 *     tags: [about]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns server information.
 *       500:
 *         description: Server error.
 */
router.get("/about.json", aboutController.getInfo);

module.exports = router;
