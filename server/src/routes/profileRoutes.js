const express = require("express");
const router = express.Router();
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
router.get("/", profileController.getUserProfile);

/**
 * @swagger
 * /profile/email:
 *   put:
 *     summary: Update the email of the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: New email address to set for the user.
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Bad Request (Invalid email format or Email is already in use)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/email", profileController.updateEmail);

/**
 * @swagger
 * /profile/username:
 *   put:
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
router.put("/username", profileController.updateUsername);

/**
 * @swagger
 * /profile/password:
 *   put:
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
router.put("/password", profileController.updatePassword);

module.exports = router;
