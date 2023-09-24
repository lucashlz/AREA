const express = require('express');
const router = express.Router();
const resetController = require("../controllers/resetController");

/**
 * @swagger
 * /reset/request_password_reset:
 *   post:
 *     summary: Request a password reset for a user
 *     tags: [Reset]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user requesting the password reset.
 *                 required: true
 *     responses:
 *       200:
 *         description: Reset email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.post("/request_password_reset", resetController.requestPasswordReset);

/**
 * @swagger
 * /reset/password:
 *   put:
 *     summary: Process the password reset request for a user with a valid reset token
 *     tags: [Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The reset token sent to the user's email.
 *               newPassword:
 *                 type: string
 *                 description: The new password the user wants to set.
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired reset token.
 *       500:
 *         description: Server error.
 */
router.post('/password', resetController.passwordReset);

module.exports = router;
