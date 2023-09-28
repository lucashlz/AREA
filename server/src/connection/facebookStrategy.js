const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModels");

passport.use(
  "facebook-connect",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/connect/facebook/callback",
      profileFields: ["id", "emails", "name"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          "externalAuth.serviceId": profile.id,
        });

        if (existingUser) {
          const isFacebookAuth = existingUser.externalAuth.some(
            (auth) => auth.service === "facebook"
          );

          if (isFacebookAuth) {
            return done(new Error("User already connected with Facebook"));
          }
        } else {
          const loggedInUser = await User.findById(req.user.id);
          if (loggedInUser) {
            const facebookService = {
              access_token: accessToken,
              refresh_token: refreshToken || "",
              data: profile._json,
            };
            loggedInUser.connectServices.set("facebook", facebookService);
            await loggedInUser.save();
            return done(null, loggedInUser, {
              accessToken,
              refreshToken,
              data: profile._json,
            });
          }
        }
        return done(
          new Error("No associated user found for this Facebook account.")
        );
      } catch (error) {
        console.error("Error during Facebook connection:", error);
        return done(error);
      }
    }
  )
);
