const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModels");

passport.use(
    "google-connect",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/connect/google/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, expires_in, profile, done) => {
            try {
                const user = req.user;
                const existingUser = await User.findOne({
                    "externalAuth.serviceId": profile.id,
                });
                if (existingUser) {
                    const isGoogleAuth = existingUser.externalAuth.some(
                        (auth) => auth.service === "google"
                    );
                    if (isGoogleAuth) {
                        return done(new Error("User already connected with Google"));
                    }
                } else {
                    const googleService = {
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        expires_in: expires_in * 1000,
                        tokenIssuedAt: Date.now(),
                        data: profile._json,
                    };
                    user.connectServices.set("google", googleService);
                    await user.save();
                    return done(null, user);
                }
                return done(new Error("No associated user found for this Google account."));
            } catch (error) {
                console.error("Error during Google connection:", error);
                return done(error);
            }
        }
    )
);
