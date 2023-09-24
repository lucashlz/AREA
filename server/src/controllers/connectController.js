const User = require("../models/user");

exports.connectGoogle = async (token, refreshToken, profile, done) => {
  try {
    let user = await User.findById(req.user.id);
    if (user) {
      if (!user.connectServices.google) {
        user.connectServices.set("google", {
          access_token: token,
          refresh_token: refreshToken,
          data: {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          },
        });
        await user.save();
      }
    } else {
      done(new Error("User not found."));
      return;
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
};

exports.connectFacebook = async (token, refreshToken, profile, done) => {
  try {
    let user = await User.findById(req.user.id);
    if (user) {
      if (!user.connectServices.facebook) {
        user.connectServices.set("facebook", {
          access_token: token,
          refresh_token: refreshToken,
          data: {
            id: profile.id,
            email: profile.emails ? profile.emails[0].value : null,
            name: profile.displayName,
          },
        });
        await user.save();
      }
    } else {
      done(new Error("User not found."));
      return;
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
};

exports.connectGitHub = async (token, refreshToken, profile, done) => {
  try {
    let user = await User.findById(req.user.id);
    if (user) {
      if (!user.connectServices.github) {
        user.connectServices.set("github", {
          access_token: token,
          refresh_token: refreshToken,
          data: {
            id: profile.id,
            email: profile.emails ? profile.emails[0].value : null,
            name: profile.displayName,
          },
        });
        await user.save();
      }
    } else {
      done(new Error("User not found."));
      return;
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
};
