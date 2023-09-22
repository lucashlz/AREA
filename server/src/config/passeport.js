const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (token, tokenSecret, profile, done) => {
      let user = await User.findOne({
        oauthId: profile.id,
      });

      if (!user) {
        user = new User({
          email: profile.emails[0].value,
          authMethod: "google",
          oauthId: profile.id,
          confirmed: true,
        });
        await user.save();
      }

      done(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "emails"],
    },
    async (token, tokenSecret, profile, done) => {
      let user = await User.findOne({
        oauthId: profile.id,
      });

      if (!user) {
        user = new User({
          email: profile.emails[0].value,
          authMethod: "facebook",
          oauthId: profile.id,
          confirmed: true,
        });
        await user.save();
      }

      done(null, user);
    }
  )
);

module.exports = passport;
