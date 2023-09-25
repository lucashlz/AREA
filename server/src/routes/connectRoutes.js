const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

/**
 * @swagger
 * /connect/google:
 *   get:
 *     summary: Connect an authenticated user's account with Google
 *     tags: [Connect]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication.
 */
router.get(
  "/google",
  passport.authenticate("google-connect", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  })
);

/**
 * @swagger
 * /connect/google/callback:
 *   get:
 *     summary: Callback route after Google authentication for connecting an authenticated user's account with Google
 *     tags: [Connect]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       302:
 *         description: Redirect to home or error page depending on the result of the connection process.
 *       400:
 *         description: Bad request, typically due to missing or incorrect parameters.
 *       500:
 *         description: Server error.
 */
router.get(
  "/google/callback",
  passport.authenticate("google-connect", { failureRedirect: "/" }),
);

module.exports = router;
