const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const emailService = require("../utils/emailUtils");
require("../auth/googleStrategy");
require("../auth/facebookStrategy");

exports.sign_up = async (req, res) => {
  try {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!req.body.email || !emailRegex.test(req.body.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!req.body.username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (!req.body.authProvider && !req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }

    let user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    user = new User(req.body);

    user.username = req.body.username;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const confirmationToken = crypto.randomBytes(20).toString("hex");
    user.confirmationToken = confirmationToken;

    await user.save();

    emailService.sendConfirmationMail(user.email, confirmationToken);

    res
      .status(200)
      .json({ message: "User registered. Please confirm your email." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.confirm = async (req, res) => {
  try {
    const user = await User.findOne({ confirmationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    user.confirmed = true;
    user.confirmationToken = undefined;
    await user.save();
    res.status(200).json({ message: "Account confirmed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.confirmEmailChange = async (req, res) => {
  try {
    const user = await User.findOne({ emailChangeToken: req.params.token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.pendingEmail) {
      user.email = user.pendingEmail;
      user.pendingEmail = undefined;
    }

    user.emailChangeToken = undefined;
    await user.save();
    res.status(200).json({ message: "Email changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sign_in = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.confirmed) {
      return res
        .status(400)
        .json({ message: "Please confirm your account first" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
      expiresIn: "24h",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.redirectToGoogle = passport.authenticate("google-auth", {
  scope: ["profile", "email"],
});

exports.handleGoogleCallback = (req, res, next) => {
  passport.authenticate("google-auth", (err, user, info) => {
    if (err) {
      console.error("error : ", err.message);
      return res
        .status(500)
        .json({ message: "Server error during authentication." });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Authentication failed." });
    }
    try {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
        expiresIn: "24h",
      });
      // add condition if mobile to redirect to desired path, ex : if req.query.from === 'mobile', res.redirect("myapp://account")
      res.status(200).redirect(`http://localhost:8081/applets?token=${token}`);
    } catch (error) {
      console.error("try: ", error.message);
      res.status(500).json({ message: "Server error generating token." });
    }
  })(req, res, next);
};

exports.redirectToFacebook = passport.authenticate("facebook-auth", {
  scope: ["email"],
});

exports.handleFacebookCallback = (req, res, next) => {
  passport.authenticate("facebook-auth", async (err, user, info) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ message: "Server error during authentication." });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Authentication failed." });
    }
    try {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
        expiresIn: "24h",
      });
      res.status(200).json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server error generating token." });
    }
  })(req, res, next);
};
