const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServiceInfoSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
});

const ServiceSchema = new Schema({
    access_token: {
        type: String,
        default: "",
    },
    refresh_token: {
        type: String,
        default: "",
    },
    expires_in: {
        type: Number,
        default: null,
    },
    data: {
        type: Object,
        default: {},
    },
    serviceInfo: {
        type: ServiceInfoSchema,
        required: true,
    },
});

const ExternalAuthServiceSchema = new Schema(
    {
        service: String,
        serviceId: String,
    },
);

const userSchema = new mongoose.Schema({
    username: { type: String, default: "" },
    email: { type: String, required: true },
    password: { type: String },
    pendingEmail: { type: String },
    emailChangeToken: { type: String },
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
