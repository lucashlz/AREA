const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendConfirmationMail = (email, confirmationToken) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "[AREA] Please confirm your email",
    text: `Click this link to confirm your email: http://localhost:8080/auth/confirm/${confirmationToken}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.sendPasswordResetMail = (email, resetToken) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "[AREA] Password Reset Request",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
    http://localhost:8080/reset/password/${resetToken}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
