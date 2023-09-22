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
    subject: "Please confirm your email",
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
