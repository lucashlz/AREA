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

const ExternalAuthServiceSchema = new Schema(
  {
    service: String,
    serviceId: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, required: true },
  password: { type: String },
  confirmed: { type: Boolean, default: false },
  confirmationToken: { type: String },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  connectServices: {
    type: Map,
    of: ServiceSchema,
    default: {},
  },
  externalAuth: [ExternalAuthServiceSchema],
});

module.exports = mongoose.model("User", userSchema);
