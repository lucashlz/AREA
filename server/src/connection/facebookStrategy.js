const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModels");

passport.use(
    "facebook-connect",
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/connect/facebook/callback",
            profileFields: ["id", "emails", "name"],
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const loggedInUser = await User.findById(req.user.id);
                if (!loggedInUser) {
                    return done(new Error("No associated user found for this session."));
                }
                const isFacebookAuth = loggedInUser.externalAuth.some(
                    (auth) => auth.service === "facebook"
                );
                if (isFacebookAuth) {
                    return done(new Error("User already connected with Facebook"));
                }
                const facebookService = {
                    access_token: accessToken,
                    refresh_token: refreshToken || "",
                    data: profile._json,
                };
                loggedInUser.connectServices.set("facebook", facebookService);
                await loggedInUser.save();
                return done(null, loggedInUser);
            } catch (error) {
                console.error("Error during Facebook connection:", error);
                return done(error);
            }
        }
    )
);
