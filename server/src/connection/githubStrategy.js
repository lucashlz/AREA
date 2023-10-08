const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/userModels");

passport.use(
    "github-connect",
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/connect/github/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const loggedInUser = await User.findById(req.user.id);
                if (!loggedInUser) {
                    return done(new Error("No associated user found for this session."));
                }
                const githubService = {
                    access_token: accessToken,
                    refresh_token: refreshToken || "",
                    data: profile._json,
                };
                loggedInUser.connectServices.set("github", githubService);
                await loggedInUser.save();
                return done(null, loggedInUser);
            } catch (error) {
                console.error("Error during GitHub connection:", error);
                return done(error);
            }
        }
    )
);
