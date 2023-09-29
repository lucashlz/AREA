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
        const existingUser = await User.findOne({
          "externalAuth.serviceId": profile.id,
        });

        if (existingUser) {
          const isGithubAuth = existingUser.externalAuth.some(
            (auth) => auth.service === "github"
          );
          if (isGithubAuth) {
            return done(new Error("User already connected with GitHub"));
          }
        } else {
          const loggedInUser = await User.findById(req.user.id);
          if (loggedInUser) {
            const githubService = {
              access_token: accessToken,
              refresh_token: refreshToken,
              data: profile._json,
            };
            loggedInUser.connectServices.set("github", githubService);
            await loggedInUser.save();
            return done(null, loggedInUser, {
              accessToken,
              refreshToken,
              data: profile._json,
            });
          }
        }
        return done(
          new Error("No associated user found for this GitHub account.")
        );
      } catch (error) {
        console.error("Error during GitHub connection:", error);
        return done(error);
      }
    }
  )
);
