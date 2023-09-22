const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/middleware");
const profileController = require("../controllers/profileController");

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Retrieve the profile of the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 confirmed:
 *                   type: boolean
 *                 isGoogleAuth:
 *                   type: boolean
 *                 isFacebookAuth:
 *                   type: boolean
 *                 connectServices:
 *                   type: object
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/", isAuthenticated, profileController.getUserProfile);

/**
 * @swagger
 * /profile/username:
 *   post:
 *     summary: Update the username of the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 username:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/username", isAuthenticated, profileController.updateUsername);

/**
 * @swagger
 * /profile/password:
 *   post:
 *     summary: Update the password of the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password of the user for verification.
 *               newPassword:
 *                 type: string
 *                 description: New password the user wants to set.
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Old password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/password", isAuthenticated, profileController.updatePassword);

/**
 * @swagger
 * /profile/request_password_reset:
 *   post:
 *     summary: Request a password reset for a user
 *     tags: [Profile]
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
router.post("/request_password_reset", profileController.requestPasswordReset);

module.exports = router;
