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
                const loggedInUser = await User.findById(req.user.id);
                if (!loggedInUser) {
                    return done(new Error("No associated user found for this session."));
                }
                const twitchService = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    data: profile._json,
                };
                loggedInUser.connectServices.set("twitch", twitchService);
                await loggedInUser.save();
                return done(null, loggedInUser);
            } catch (error) {
                console.error("Error during Twitch connection:", error);
                return done(error);
            }
        }
    )
);
