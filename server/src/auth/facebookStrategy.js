const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModels");
const {
  findUserByExternalId,
  updateUserConnectionService,
  createNewExternalUser,
} = require("../utils/authUtils");

passport.use(
  "facebook-auth",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await findUserByExternalId("facebook", profile.id);

        if (existingUser) {
          await updateUserConnectionService(existingUser, "facebook", {
            access_token: accessToken,
            data: profile,
          });
          return done(null, existingUser);
        }

        const userWithEmail = await User.findOne({
          email: profile.emails[0].value,
        });

        if (userWithEmail) {
          const hasGoogleAuth =
            userWithEmail.externalAuth &&
            userWithEmail.externalAuth.some(
              (service) => service.service === "google"
            );

          if (hasGoogleAuth) {
            return done(null, false, {
              message:
                "This email is already registered using Google. Please log in using Google.",
            });
          } else {
            return done(null, false, {
              message:
                "An account with this email already exists. Please login using your email and password.",
            });
          }
        }

        const newUser = await createNewExternalUser(
          "facebook",
          profile.emails[0].value,
          profile.id,
          {
            access_token: accessToken,
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
