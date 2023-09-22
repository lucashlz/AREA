const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String },
  oauthProvider: { type: String },
  oauthId: { type: String },
  services: [String],
  confirmed: { type: Boolean, default: false },
  confirmationToken: { type: String },
});

module.exports = mongoose.model("User", userSchema);
