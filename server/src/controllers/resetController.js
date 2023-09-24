const crypto = require("crypto");
const { sendPasswordResetMail } = require("../utils/emailServices");

exports.requestPasswordReset = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();
      sendPasswordResetMail(user.email, resetToken);

      res.json({ message: "Reset email sent" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.passwordReset = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.json({ message: "Password reset successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
