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
        async (req, accessToken, refreshToken, expires_in, profile, done) => {
            try {
                const user = req.user;
                if (!user) {
                    return done(new Error("No associated user found for this session."));
                }
                const githubService = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: (expires_in && typeof expires_in === 'number') ? expires_in * 1000 : null,
                    tokenIssuedAt: Date.now(),
                    data: profile._json,
                };
                user.connectServices.set("github", githubService);
                await user.save();
                return done(null, user);
            } catch (error) {
                console.error("Error during GitHub connection:", error);
                return done(error);
            }
        }
    )
);
