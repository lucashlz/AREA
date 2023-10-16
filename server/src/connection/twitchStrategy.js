const passport = require("passport");
const TwitchStrategy = require("passport-twitch-new").Strategy;

passport.use(
    "twitch-connect",
    new TwitchStrategy(
        {
            clientID: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/connect/twitch/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, { expires_in }, profile, done) => {
            try {
                const user = req.user;
                const twitchService = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: expires_in * 1000,
                    tokenIssuedAt: Date.now(),
                    data: profile,
                };
                user.connectServices.set("twitch", twitchService);
                await user.save();
                return done(null, user);
            } catch (error) {
                console.error("Error during Twitch connection:", error);
                return done(error);
            }
        }
    )
);
