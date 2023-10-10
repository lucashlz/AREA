const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete the logged-in user
 *     tags: [users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete", usersController.deleteLoggedInUser);

module.exports = router;
