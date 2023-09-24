const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const emailService = require("../utils/emailServices");

exports.sign_up = async (req, res) => {
  try {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!req.body.email || !emailRegex.test(req.body.email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    if (!req.body.username) {
      return res.status(400).json({ msg: "Username is required" });
    }

    if (!req.body.oauthProvider && !req.body.password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    let user = await User.findOne({
      email: req.body.email,
      isGoogleAuth: false,
      isFacebookAuth: false,
    });
    if (user) {
      return res.status(409).json({ msg: "User already exists" });
    }

    user = new User(req.body);

    user.username = req.body.username;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const confirmationToken = crypto.randomBytes(20).toString("hex");
    user.confirmationToken = confirmationToken;
    user.isGoogleAuth = false;
    user.isFacebookAuth = false;

    await user.save();

    emailService.sendConfirmationMail(user.email, confirmationToken);

    res
      .status(200)
      .json({ msg: "User registered. Please confirm your email." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.confirm = async (req, res) => {
  try {
    const user = await User.findOne({ confirmationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }
    user.confirmed = true;
    user.confirmationToken = undefined;
    await user.save();
    res.status(200).json({ msg: "Account confirmed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.sign_in = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      isGoogleAuth: false,
      isFacebookAuth: false,
    });
    if (!user) {
      return res.status(401).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.confirmed) {
      return res.status(400).json({ msg: "Please confirm your account first" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
      expiresIn: "24h",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
