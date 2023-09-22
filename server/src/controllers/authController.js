const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const emailService = require("../utils/emailServices");

exports.register = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    if (!req.body.oauthProvider && !req.body.password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User(req.body);
    console.log("New user object:", user);

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

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.confirmed) {
      return res.status(400).json({ msg: "Please confirm your account first" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
