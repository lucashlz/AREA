const mongoose = require("mongoose");

const { Schema } = mongoose;

const ServiceSchema = new Schema({
  access_token: {
    type: String,
    default: "",
  },
  refresh_token: {
    type: String,
    default: "",
  },
  data: {
    type: Object,
    default: {},
  },
});

const userSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, required: true },
  password: { type: String },
  confirmed: { type: Boolean, default: false },
  confirmationToken: { type: String },
  isGoogleAuth: {
    type: Boolean,
    required: true,
    default: false,
  },
  isFacebookAuth: {
    type: Boolean,
    required: true,
    default: false,
  },
  connectServices: {
    type: Map,
    of: ServiceSchema,
    default: {},
  },
});

module.exports = mongoose.model("User", userSchema);
