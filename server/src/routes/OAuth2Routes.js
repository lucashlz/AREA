const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

/**
 * @swagger
 * /OAuth2/google:
 *   get:
 *     summary: Authenticate using Google OAuth2
 *     tags: [OAuth2]
 *     responses:
 *       302:
 *         description: Redirect to Google login.
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  })
);

/**
 * @swagger
 * /OAuth2/google/callback:
 *   get:
 *     summary: Callback route after Google authentication
 *     tags: [OAuth2]
 *     responses:
 *       302:
 *         description: Redirect to home or error page.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/")
);

/**
 * @swagger
 * /OAuth2/facebook:
 *   get:
 *     summary: Authenticate using Facebook OAuth2
 *     tags: [OAuth2]
 *     responses:
 *       302:
 *         description: Redirect to Facebook login.
 */
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

/**
 * @swagger
 * /OAuth2/facebook/callback:
 *   get:
 *     summary: Callback route after Facebook authentication
 *     tags: [OAuth2]
 *     responses:
 *       302:
 *         description: Redirect to home or error page.
 */
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => res.redirect("/")
);

module.exports = router;
