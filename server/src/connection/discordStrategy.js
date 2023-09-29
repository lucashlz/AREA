const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const User = require("../models/userModels");

passport.use(
  "discord-connect",
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/connect/discord/callback",
      scope: ["identify", "email"], // Adjust the scopes according to your needs.
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          "externalAuth.serviceId": profile.id,
        });

        if (existingUser) {
          const isDiscordAuth = existingUser.externalAuth.some(
            (auth) => auth.service === "discord"
          );
          if (isDiscordAuth) {
            return done(new Error("User already connected with Discord"));
          }
        } else {
          const loggedInUser = await User.findById(req.user.id);
          if (loggedInUser) {
            const discordService = {
              access_token: accessToken,
              refresh_token: refreshToken,
              data: profile,
            };
            loggedInUser.connectServices.set("discord", discordService);
            await loggedInUser.save();
            return done(null, loggedInUser, {
              accessToken,
              refreshToken,
              data: profile,
            });
          }
        }
        return done(
          new Error("No associated user found for this Discord account.")
        );
      } catch (error) {
        console.error("Error during Discord connection:", error);
        return done(error);
      }
    }
  )
);
