const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");

function setupAppMiddleware(app) {
  app.use(
    session({
      secret: "your_secret_key",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());
}

function isAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
}

module.exports = {
  setupAppMiddleware,
  isAuthenticated,
};
