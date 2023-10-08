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
            scope: ["identify", "email"],
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const loggedInUser = await User.findById(req.user.id);
                if (!loggedInUser) {
                    return done(new Error("No associated user found for this session."));
                }
                const discordService = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    data: profile,
                };
                loggedInUser.connectServices.set("discord", discordService);
                await loggedInUser.save();
                return done(null, loggedInUser);
            } catch (error) {
                console.error("Error during Discord connection:", error);
                return done(error);
            }
        }
    )
);
