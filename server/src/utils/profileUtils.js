const User = require("../models/userModels");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { sendEmailChangeConfirmationMail } = require("./emailUtils");

const hasAuthService = (user, serviceName) =>
  user.externalAuth &&
  user.externalAuth.some((service) => service.service === serviceName);

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

const updateUserEmail = async (user, newEmail) => {
  if (!validateEmail(newEmail)) {
    throw new Error("Invalid email format");
  }

  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser && String(existingUser._id) !== String(user._id)) {
    throw new Error("Email is already in use");
  }

  const emailChangeToken = crypto.randomBytes(32).toString("hex");

  user.pendingEmail = newEmail;
  user.emailChangeToken = emailChangeToken;

  await sendEmailChangeConfirmationMail(newEmail, emailChangeToken);
};

const updateUserPassword = async (user, oldPassword, newPassword) => {
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Old password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;
};

module.exports = {
  hasAuthService,
  updateUserEmail,
  updateUserPassword,
};
