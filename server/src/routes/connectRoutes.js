const express = require("express");
const router = express.Router();
const connectController = require("../controllers/connectController");

/**
 * @swagger
 * /connect/google:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Connect to Google account
 *     responses:
 *       200:
 *         description: Redirect to Google authentication page.
 */
router.get("/google", connectController.connectGoogleAccount);

/**
 * @swagger
 * /connect/google/callback:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Callback from Google authentication
 *     responses:
 *       200:
 *         description: Google connection successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error or failed to save user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.get("/google/callback", connectController.connectGoogleCallback);

/**
 * @swagger
 * /connect/facebook:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Connect to Facebook account
 *     responses:
 *       200:
 *         description: Redirect to Facebook authentication page.
 */
router.get("/facebook", connectController.connectFacebookAccount);

/**
 * @swagger
 * /connect/facebook/callback:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Callback from Facebook authentication
 *     responses:
 *       200:
 *         description: Facebook connection successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error or failed to save user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.get("/facebook/callback", connectController.connectFacebookCallback);

module.exports = router;
