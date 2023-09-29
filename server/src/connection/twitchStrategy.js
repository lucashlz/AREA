const passport = require("passport");
const TwitchStrategy = require("passport-twitch-new").Strategy;
const User = require("../models/userModels");

passport.use(
  "twitch-connect",
  new TwitchStrategy(
    {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/connect/twitch/callback",
      scope: "user_read",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          "externalAuth.serviceId": profile.id,
        });

        if (existingUser) {
          const isTwitchAuth = existingUser.externalAuth.some(
            (auth) => auth.service === "twitch"
          );
          if (isTwitchAuth) {
            return done(new Error("User already connected with Twitch"));
          }
        } else {
          const loggedInUser = await User.findById(req.user.id);
          if (loggedInUser) {
            const twitchService = {
              access_token: accessToken,
              refresh_token: refreshToken,
              data: profile._json,
            };
            loggedInUser.connectServices.set("twitch", twitchService);
            await loggedInUser.save();
            return done(null, loggedInUser, {
              accessToken,
              refreshToken,
              data: profile._json,
            });
          }
        }
        return done(
          new Error("No associated user found for this Twitch account.")
        );
      } catch (error) {
        console.error("Error during Twitch connection:", error);
        return done(error);
      }
    }
  )
);
