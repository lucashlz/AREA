const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

function setupAppMiddleware(app) {
  app.use(
    session({
      secret: "your_secret_key",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());
}

function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log("Received token:", token);

  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    console.log("Decoded JWT:", decoded);

    req.user = decoded;
    next();
  } catch (ex) {
    console.error("JWT Verification Error:", ex.message);
    res.status(400).send("Invalid token.");
  }
}

module.exports = {
  setupAppMiddleware,
  authMiddleware,
};
