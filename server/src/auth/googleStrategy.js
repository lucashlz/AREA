const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { findUserByExternalId, createNewExternalUser } = require("../utils/authUtils");

passport.use(
    "google-auth",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Full profile:", JSON.stringify(profile, null, 2));
            const email = profile.emails[0].value;

            let existingUser = await findUserByExternalId("google", email);
            if (existingUser) {
                return done(null, existingUser);
            }

            try {
                const newUser = await createNewExternalUser("google", email);
                return done(null, newUser);
            } catch (err) {
                console.error(err);
                return done(err);
            }
        }
    )
);
