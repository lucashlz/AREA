const express = require("express");
const router = express.Router();
const resetController = require("../controllers/resetController");

/**
 * @swagger
 * /reset/request_password_reset:
 *   post:
 *     summary: Sends a password reset link to the user's email
 *     tags: [Reset]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user requesting a password reset.
 *                 required: true
 *     responses:
 *       200:
 *         description: Reset link email sent.
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
 * /reset/password/{token}:
 *   get:
 *     summary: Display the form (or page) for the user to set a new password.
 *     tags: [Reset]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token received in the email link.
 *     responses:
 *       200:
 *         description: Successfully fetched the password reset form/page.
 *       400:
 *         description: Invalid or expired token.
 *       500:
 *         description: Server error.
 */
router.get("/password/:token", resetController.displayResetForm);

/**
 * @swagger
 * /reset/password:
 *   post:
 *     summary: Updates the user's password using the provided token and new password.
 *     tags: [Reset]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token received in the email link.
 *                 required: true
 *               newPassword:
 *                 type: string
 *                 description: The new password the user wants to set.
 *                 required: true
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request (e.g., Missing token or new password).
 *       500:
 *         description: Server error.
 */
router.post("/reset/password", resetController.updatePassword);

module.exports = router;
