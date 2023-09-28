const passport = require("passport");

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
