const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -confirmationToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEmail = async (req, res) => {
  const { email } = req.body;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser && String(existingUser._id) !== String(req.user.id)) {
    return res.status(400).json({ message: "Email is already in use" });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.email = email;
    await user.save();
    res.json({
      message: "Email updated successfully",
      email: user.email,
    });
  } catch (err) {
    console.error("Error updating email:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUsername = async (req, res) => {
  const { username } = req.body;

  const user = await User.findById(req.user.id);
  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    await user.save();

    res.json({
      message: "Username updated successfully",
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
