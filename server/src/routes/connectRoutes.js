const express = require("express");
const router = express.Router();
const connectController = require("../controllers/connectController");
const { ensureAuthenticated } = require("../middleware/middleware");

/**
 * @swagger
 * /connect/getYoutubeOAuthConstants:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Fetches Youtube OAuth constants
 *     responses:
 *       200:
 *         description: Returns Youtube OAuth constants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientId:
 *                   type: string
 *                   description: The client ID for Youtube API.
 *                 redirectUri:
 *                   type: string
 *                   description: The redirect URI for Youtube authentication callback.
 *                 scopes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The scopes required for Youtube authentication.
 *                 oAuthSessionId:
 *                   type: string
 *                   description: The OAuth session ID for the current user.
 *       500:
 *         description: Failed to initiate OAuth session.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Failed to initiate OAuth session.
 */
router.get("/getYoutubeOAuthConstants", ensureAuthenticated, connectController.getYoutubeOAuthConstants);

/**
 * @swagger
 * /connect/youtube/callback:
 *   get:
 *     tags:
 *       - connect
 *     description: Callback from Youtube authentication
 *     responses:
 *       200:
 *         description: Youtube connection successful.
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
router.get("/youtube/callback", connectController.youtubeCallback);

/**
 * @swagger
 * /connect/getGmailOAuthConstants:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Fetches Gmail OAuth constants
 *     responses:
 *       200:
 *         description: Returns Gmail OAuth constants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientId:
 *                   type: string
 *                   description: The client ID for Gmail API.
 *                 redirectUri:
 *                   type: string
 *                   description: The redirect URI for Gmail authentication callback.
 *                 scopes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The scopes required for Gmail authentication.
 *                 oAuthSessionId:
 *                   type: string
 *                   description: The OAuth session ID for the current user.
 *       500:
 *         description: Failed to initiate OAuth session.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Failed to initiate OAuth session.
 */
router.get("/getGmailOAuthConstants", ensureAuthenticated, connectController.getGmailOAuthConstants);

/**
 * @swagger
 * /connect/gmail/callback:
 *   get:
 *     tags:
 *       - connect
 *     description: Callback from Gmail authentication
 *     responses:
 *       200:
 *         description: Gmail connection successful.
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
router.get("/gmail/callback", connectController.gmailCallback);

/**
 * @swagger
 * /connect/getGithubOAuthConstants:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Fetches Github OAuth constants
 *     responses:
 *       200:
 *         description: Returns Github OAuth constants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientId:
 *                   type: string
 *                   description: The client ID for Github API.
 *                 redirectUri:
 *                   type: string
 *                   description: The redirect URI for Github authentication callback.
 *                 scopes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The scopes required for Github authentication.
 *                 oAuthSessionId:
 *                   type: string
 *                   description: The OAuth session ID for the current user.
 *       500:
 *         description: Failed to initiate OAuth session.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Failed to initiate OAuth session.
 */
router.get("/getGithubOAuthConstants", ensureAuthenticated, connectController.getGithubOAuthConstants);

/**
 * @swagger
 * /connect/github/callback:
 *   get:
 *     tags:
 *       - connect
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
router.get("/github/callback", connectController.githubCallback);

/**
 * @swagger
 * /connect/getSpotifyOAuthConstants:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Fetches Spotify OAuth constants
 *     responses:
 *       200:
 *         description: Returns Spotify OAuth constants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientId:
 *                   type: string
 *                   description: The client ID for Spotify API.
 *                 redirectUri:
 *                   type: string
 *                   description: The redirect URI for Spotify authentication callback.
 *                 scopes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The scopes required for Spotify authentication.
 *                 oAuthSessionId:
 *                   type: string
 *                   description: The OAuth session ID for the current user.
 *       500:
 *         description: Failed to initiate OAuth session.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Failed to initiate OAuth session.
 */
router.get("/getSpotifyOAuthConstants", ensureAuthenticated, connectController.getSpotifyOAuthConstants);

/**
 * @swagger
 * /connect/spotify/callback:
 *   get:
 *     tags:
 *       - connect
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
router.get("/spotify/callback", connectController.spotifyCallback);

/**
 * @swagger
 * /connect/getTwitchOAuthConstants:
 *   get:
 *     tags:
 *       - connect
 *     security:
 *       - bearerAuth: []
 *     description: Fetches Twitch OAuth constants
 *     responses:
 *       200:
 *         description: Returns Twitch OAuth constants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientId:
 *                   type: string
 *                   description: The client ID for Twitch API.
 *                 redirectUri:
 *                   type: string
 *                   description: The redirect URI for Twitch authentication callback.
 *                 scopes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The scopes required for Twitch authentication.
 *                 oAuthSessionId:
 *                   type: string
 *                   description: The OAuth session ID for the current user.
 *       500:
 *         description: Failed to initiate OAuth session.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Failed to initiate OAuth session.
 */
router.get("/getTwitchOAuthConstants", ensureAuthenticated, connectController.getTwitchOAuthConstants);

/**
 * @swagger
 * /connect/twitch/callback:
 *   get:
 *     tags:
 *       - connect
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
router.get("/twitch/callback", connectController.twitchCallback);

module.exports = router;
