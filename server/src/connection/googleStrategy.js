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
        async (req, accessToken, refreshToken, profile, done) => {
            try {
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
                    const loggedInUser = await User.findById(req.user.id);
                    if (loggedInUser) {
                        const googleService = {
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            data: profile._json,
                        };
                        loggedInUser.connectServices.set("google", googleService);
                        await loggedInUser.save();
                        return done(null, loggedInUser);
                    }
                }
                return done(new Error("No associated user found for this Google account."));
            } catch (error) {
                console.error("Error during Google connection:", error);
                return done(error);
            }
        }
    )
);
