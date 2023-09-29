const passport = require("passport");
require("../connection/googleStrategy");
require("../connection/facebookStrategy");
require("../connection/githubStrategy");
require("../connection/discordStrategy");
require("../connection/spotifyStrategy");
require("../connection/twitchStrategy");

exports.connectGoogleAccount = passport.authenticate("google-connect", {
  scope: ["profile", "email"],
});

exports.connectGoogleCallback = (req, res, next) => {
  passport.authenticate("google-connect", (err, user, authInfo) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error." });
    }
    if (!user) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication failed." });
    }
    user.connectServices.set("google", {
      access_token: authInfo.accessToken,
      refresh_token: authInfo.refreshToken,
      data: authInfo.data,
    });
    user
      .save()
      .then(() =>
        res.json({
          status: "success",
          message: "Google connection successful.",
        })
      )
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ status: "error", message: "Failed to save user data." });
      });
  })(req, res, next);
};

exports.connectFacebookAccount = passport.authenticate("facebook-connect", {
  scope: ["email"],
});

exports.connectFacebookCallback = (req, res, next) => {
  passport.authenticate("facebook-connect", (err, user, authInfo) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error." });
    }
    if (!user) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication failed." });
    }
    user.connectServices.set("facebook", {
      access_token: authInfo.accessToken,
      refresh_token: authInfo.refreshToken,
      data: authInfo.data,
    });
    user
      .save()
      .then(() =>
        res.json({
          status: "success",
          message: "Facebook connection successful.",
        })
      )
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ status: "error", message: "Failed to save user data." });
      });
  })(req, res, next);
};

exports.connectGitHubAccount = passport.authenticate("github-connect", {
  scope: ["user:email"],
});

exports.connectGitHubCallback = (req, res, next) => {
  passport.authenticate("github-connect", (err, user, authInfo) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error." });
    }
    if (!user) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication failed." });
    }
    user.connectServices.set("github", {
      access_token: authInfo.accessToken,
      refresh_token: authInfo.refreshToken,
      data: authInfo.data,
    });
    user
      .save()
      .then(() =>
        res.json({
          status: "success",
          message: "GitHub connection successful.",
        })
      )
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ status: "error", message: "Failed to save user data." });
      });
  })(req, res, next);
};

exports.connectSpotifyAccount = passport.authenticate("spotify-connect", {
  scope: ["user-read-email", "user-read-private"],
});

exports.connectSpotifyCallback = (req, res, next) => {
  passport.authenticate("spotify-connect", (err, user, authInfo) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error." });
    }
    if (!user) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication failed." });
    }
    user.connectServices.set("spotify", {
      access_token: authInfo.accessToken,
      refresh_token: authInfo.refreshToken,
      expires_in: authInfo.expiresIn,
      data: authInfo.data,
    });
    user
      .save()
      .then(() =>
        res.json({
          status: "success",
          message: "Spotify connection successful.",
        })
      )
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ status: "error", message: "Failed to save user data." });
      });
  })(req, res, next);
};

exports.connectDiscordAccount = passport.authenticate("discord-connect", {
  scope: ["identify", "email"],
});

exports.connectDiscordCallback = (req, res, next) => {
  passport.authenticate("discord-connect", (err, user, authInfo) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error." });
    }
    if (!user) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication failed." });
    }
    user.connectServices.set("discord", {
      access_token: authInfo.accessToken,
      refresh_token: authInfo.refreshToken,
      data: authInfo.data,
    });
    user
      .save()
      .then(() =>
        res.json({
          status: "success",
          message: "Discord connection successful.",
        })
      )
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ status: "error", message: "Failed to save user data." });
      });
  })(req, res, next);
};

exports.connectTwitchAccount = passport.authenticate("twitch-connect", {
  scope: ["user_read"],
});

exports.connectTwitchCallback = (req, res, next) => {
  passport.authenticate("twitch-connect", (err, user, authInfo) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error." });
    }
    if (!user) {
      return res
        .status(401)
        .json({ status: "failed", message: "Authentication failed." });
    }
    user.connectServices.set("twitch", {
      access_token: authInfo.accessToken,
      refresh_token: authInfo.refreshToken,
      data: authInfo.data,
    });
    user
      .save()
      .then(() =>
        res.json({
          status: "success",
          message: "Twitch connection successful.",
        })
      )
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ status: "error", message: "Failed to save user data." });
      });
  })(req, res, next);
};
