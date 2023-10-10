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
        async (req, accessToken, refreshToken, expires_in, profile, done) => {
            try {
                const user = req.user;
                if (!user) {
                    return done(new Error("No associated user found for this session."));
                }
                const discordService = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: expires_in * 1000,
                    tokenIssuedAt: Date.now(),
                    data: profile._json,
                };
                user.connectServices.set("discord", discordService);
                await user.save();
                return done(null, user);
            } catch (error) {
                console.error("Error during Discord connection:", error);
                return done(error);
            }
        }
    )
);
