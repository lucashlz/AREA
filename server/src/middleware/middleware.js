const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");

module.exports = (app) => {
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
};
