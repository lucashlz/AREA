const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModels");
const {
    findUserByExternalId,
    updateUserConnectionService,
    createNewExternalUser,
} = require("../utils/authUtils");

passport.use(
    "google-auth",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/auth/google/callback",
        },
        async (accessToken, refreshToken, expires_in, profile, done) => {
            let existingUser = await findUserByExternalId("google", profile.id);

            if (existingUser) {
                await updateUserConnectionService(existingUser, "google", {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: expires_in * 1000,
                    tokenIssuedAt: Date.now(),
                    data: profile._json,
                });
                return done(null, existingUser);
            }
            try {
                const newUser = await createNewExternalUser(
                    "google",
                    profile.emails[0].value,
                    profile.id,
                    {
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        expires_in: expires_in * 1000,
                        tokenIssuedAt: Date.now(),
                        data: profile._json,
                    }
                );
                return done(null, newUser);
            } catch (err) {
                console.error(err);
                return done(err);
            }
        }
    )
);
