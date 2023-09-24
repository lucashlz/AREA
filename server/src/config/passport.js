const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const OAuth2Controller = require("../controllers/OAuth2Controller");
const connectController = require("../controllers/connectController");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/OAuth2/google/callback",
    },
    OAuth2Controller.googleOAuth2
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/OAuth2/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    OAuth2Controller.facebookOAuth2
  )
);

passport.use(
  "google-connect",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/connect/google/callback",
    },
    connectController.connectGoogle
  )
);

passport.use(
  "facebook-connect",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/connect/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    connectController.connectFacebook
  )
);

passport.use(
  "github-connect",
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/connect/github/callback",
    },
    connectController.connectGitHub
  )
);

module.exports = passport;
