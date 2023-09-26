const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModels");
const {
  findUserByExternalId,
  updateUserConnectionService,
  createNewExternalUser,
} = require("../utils/authUtils");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let existingUser = await findUserByExternalId("google", profile.id);

      if (existingUser) {
        await updateUserConnectionService(existingUser, "google", {
          access_token: accessToken,
          refresh_token: refreshToken,
          data: profile,
        });
        return done(null, existingUser);
      }

      const userWithEmail = await User.findOne({
        email: profile.emails[0].value,
      });

      if (userWithEmail) {
        const hasFacebookAuth =
          userWithEmail.externalAuth &&
          userWithEmail.externalAuth.some(
            (service) => service.service === "facebook"
          );

        if (hasFacebookAuth) {
          return done(null, false, {
            message:
              "This email is already registered using Facebook. Please log in using Facebook.",
          });
        } else {
          return done(null, false, {
            message:
              "An account with this email already exists. Please login using your email and password.",
          });
        }
      }

      try {
        const newUser = await createNewExternalUser(
          "google",
          profile.emails[0].value,
          profile.id,
          {
            access_token: accessToken,
            refresh_token: refreshToken,
            data: profile,
          }
        );
        return done(null, newUser);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);
