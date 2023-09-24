// const express = require("express");
// const router = express.Router();
// const passport = require("../config/passport");

// /**
//  * @swagger
//  * /connect/google:
//  *   get:
//  *     summary: Connect a user's account to Google
//  *     tags: [Connection]
//  *     responses:
//  *       302:
//  *         description: Redirect to Google's OAuth2 authentication.
//  *       500:
//  *         description: Server error or failed connection.
//  */
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.email",
//       "https://www.googleapis.com/auth/userinfo.profile",
//       // other service
//     ],
//   })
// );

// /**
//  * @swagger
//  * /connect/google/callback:
//  *   get:
//  *     summary: Callback route after connecting a Google account
//  *     tags: [Connection]
//  *     responses:
//  *       302:
//  *         description: Redirect to /connected if successful.
//  *       401:
//  *         description: Authentication failed.
//  *       500:
//  *         description: Server error or failed connection.
//  */
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );

// /**
//  * @swagger
//  * /connect/facebook:
//  *   get:
//  *     summary: Connect a user's account to Facebook
//  *     tags: [Connection]
//  *     responses:
//  *       302:
//  *         description: Redirect to Facebook's OAuth2 authentication.
//  *       500:
//  *         description: Server error or failed connection.
//  */
// router.get(
//   "/facebook",
//   passport.authenticate("facebook", {
//     scope: ["email", "public_profile"],
//   })
// );

// /**
//  * @swagger
//  * /connect/facebook/callback:
//  *   get:
//  *     summary: Callback route after connecting a Facebook account
//  *     tags: [Connection]
//  *     responses:
//  *       302:
//  *         description: Redirect to /connected if successful.
//  *       401:
//  *         description: Authentication failed.
//  *       500:
//  *         description: Server error or failed connection.
//  */
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );

// /**
//  * @swagger
//  * /connect/github:
//  *   get:
//  *     summary: Connect a user's account to GitHub
//  *     tags: [Connection]
//  *     responses:
//  *       302:
//  *         description: Redirect to GitHub's OAuth2 authentication.
//  *       500:
//  *         description: Server error or failed connection.
//  */
// router.get(
//   "/github",
//   passport.authenticate("github", {
//     scope: ["user:email"],
//   })
// );

// /**
//  * @swagger
//  * /connect/github/callback:
//  *   get:
//  *     summary: Callback route after connecting a GitHub account
//  *     tags: [Connection]
//  *     responses:
//  *       302:
//  *         description: Redirect to /connected if successful.
//  *       401:
//  *         description: Authentication failed.
//  *       500:
//  *         description: Server error or failed connection.
//  */
// router.get(
//   "/github/callback",
//   passport.authenticate("github", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );

// /**
//  * @swagger
//  * /connect/spotify:
//  *   get:
//  *     summary: Connect a user's account to Spotify
//  *     tags: [Connection]
//  *     responses:
//  *       302:
//  *         description: Redirect to Spotify's OAuth2 authentication.
//  *       500:
//  *         description: Server error or failed connection.
//  */
// router.get(
//   "/spotify",
//   passport.authenticate("spotify", {
//     scope: ["user-read-email", "user-read-private"],
//     showDialog: true,
//   })
// );

// /**
//  * @swagger
//  * /connect/spotify/callback:
//  *   get:
//  *     summary: Callback route after connecting a Spotify account
//  *     tags: [Connection]
//  *     responses:
//  *       302:
//  *         description: Redirect to /connected if successful.
//  *       401:
//  *         description: Authentication failed.
//  *       500:
//  *         description: Server error or failed connection.
//  */
// router.get(
//   "/spotify/callback",
//   passport.authenticate("spotify", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );

// module.exports = router;
