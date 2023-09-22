const express = require("express");
const router = express.Router();
const passport = require("../config/passeport");

/**
 * @swagger
 * /auth/google:
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
 * /auth/google/callback:
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
 * /auth/facebook:
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
 * /auth/facebook/callback:
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
