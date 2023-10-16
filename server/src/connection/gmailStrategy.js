const passport = require("passport");
const GmailStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    "gmail-connect",
    new GmailStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/connect/gmail/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, tokens, profile, done) => {
            try {
                const user = req.user;
                if (!user) {
                    return done(new Error("No associated user found for this session."));
                }
                const { expires_in: expiresIn } = tokens;
                const gmailService = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: expiresIn * 1000,
                    tokenIssuedAt: Date.now(),
                    data: profile._json,
                };
                user.connectServices.set("gmail", gmailService);
                await user.save();
                return done(null, user);
            } catch (error) {
                console.error("Error during Gmail connection:", error);
                return done(error);
            }
        }
    )
);
