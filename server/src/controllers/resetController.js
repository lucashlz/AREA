const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { sendPasswordResetMail } = require("../utils/emailServices");

exports.requestPasswordReset = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    sendPasswordResetMail(user.email, resetToken);

    res.json({ message: "Reset link email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.displayResetForm = async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }
    res.json({ message: "Password reset form would be here", token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

exports.updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required." });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password has been updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
