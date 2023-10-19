const passport = require("passport");
const YoutubeStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    "youtube-connect",
    new YoutubeStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/connect/youtube/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, tokens, profile, done) => {
            try {
                const user = req.user;
                if (!user) {
                    return done(new Error("No associated user found for this session."));
                }
                const { expires_in: expiresIn } = tokens;
                const youtubeService = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: expiresIn * 1000,
                    tokenIssuedAt: Date.now(),
                    data: profile._json,
                };
                user.connectServices.set("youtube", youtubeService);
                await user.save();
                return done(null, user);
            } catch (error) {
                console.error("Error during Youtube connection:", error);
                return done(error);
            }
        }
    )
);
