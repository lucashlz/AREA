const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (token, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
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
        } else {
          const randomPassword = generateRandomPassword();
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          user = new User({
            email: profile.emails[0].value,
            password: hashedPassword,
            confirmed: true,
            isGoogleAuth: true,
            connectServices: {
              google: {
                accessToken: token,
                refreshToken: refreshToken,
                data: {
                  id: profile.id,
                  email: profile.emails[0].value,
                  name: profile.displayName,
                },
              },
            },
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (token, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user = new User({
            email: profile.emails[0].value,
            confirmed: true,
            data: {
              id: profile.id,
              email: profile.emails[0].value,
              name: `${profile.name.givenName} ${profile.name.familyName}`,
            },
          });
          await user.save();
        } else {
          const randomPassword = generateRandomPassword();
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          user = new User({
            email: profile.emails[0].value,
            password: hashedPassword,
            confirmed: true,
            isFacebookAuth: true,
            connectServices: {
              facebook: {
                accessToken: token,
                refreshToken: refreshToken,
                data: {
                  id: profile.id,
                  email: profile.emails[0].value,
                  name: `${profile.name.givenName} ${profile.name.familyName}`,
                },
              },
            },
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
