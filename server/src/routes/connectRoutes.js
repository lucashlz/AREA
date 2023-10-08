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

/**
 * @swagger
 * /connect/github:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Connect to GitHub account
 *     responses:
 *       200:
 *         description: Redirect to GitHub authentication page.
 */
router.get("/github", connectController.connectGitHubAccount);

/**
 * @swagger
 * /connect/github/callback:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Callback from GitHub authentication
 *     responses:
 *       200:
 *         description: GitHub connection successful.
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
router.get("/github/callback", connectController.connectGitHubCallback);

/**
 * @swagger
 * /connect/spotify:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Connect to Spotify account
 *     responses:
 *       200:
 *         description: Redirect to Spotify authentication page.
 */
router.get("/spotify", connectController.connectSpotifyAccount);

/**
 * @swagger
 * /connect/spotify/callback:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Callback from Spotify authentication
 *     responses:
 *       200:
 *         description: Spotify connection successful.
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
router.get("/spotify/callback", connectController.connectSpotifyCallback);

/**
 * @swagger
 * /connect/discord:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Connect to Discord account
 *     responses:
 *       200:
 *         description: Redirect to Discord authentication page.
 */
router.get("/discord", connectController.connectDiscordAccount);

/**
 * @swagger
 * /connect/discord/callback:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Callback from Discord authentication
 *     responses:
 *       200:
 *         description: Discord connection successful.
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
router.get("/discord/callback", connectController.connectDiscordCallback);

/**
 * @swagger
 * /connect/twitch:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Connect to Twitch account
 *     responses:
 *       200:
 *         description: Redirect to Twitch authentication page.
 */
router.get("/twitch", connectController.connectTwitchAccount);

/**
 * @swagger
 * /connect/twitch/callback:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Callback from Twitch authentication
 *     responses:
 *       200:
 *         description: Twitch connection successful.
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
router.get("/twitch/callback", connectController.connectTwitchCallback);

module.exports = router;
