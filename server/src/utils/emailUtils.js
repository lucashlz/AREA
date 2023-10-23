const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const iftttLogoUrl = "https://images.ctfassets.net/mrsnpomeucef/4FcLBcGJLV3Tru34MImgA3/3a4c836ebf29d4363c4a172e62ee5e80/Wordmark_on_gray.png";

const generateMailTemplate = (bodyContent) => {
    return `
    <div style="font-family: 'Archivo', Arial, sans-serif; padding: 40px; font-size: 16px; background-color: #f5f5f5;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="${iftttLogoUrl}" alt="IFTTT Logo" style="max-width: 250px; border: none;">
            </div>
            ${bodyContent}
        </div>
        <div style="padding-top: 30px; text-align: center;">
            <p style="color: #999999;">&copy; ${new Date().getFullYear()} AREA. All rights reserved.</p>
        </div>
    </div>
    `;
};

const sendConfirmationMail = async (email, confirmationToken) => {
  const bodyContent = `
    <p>To confirm your email, please click the link below:</p>
    <p><a href="http://localhost:8081/auth/confirm/${confirmationToken}" style="color: #4CAF50;">Confirm Your Email</a></p>
  `;

  const mailOptions = {
    from: `"IFTTT" <${process.env.EMAIL}>`,
    to: email,
    subject: "[IFTTT] Please confirm your email",
    html: generateMailTemplate(bodyContent)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendEmailChangeConfirmationMail = async (email, emailChangeToken) => {
  const bodyContent = `
    <p>To confirm your email change, please click the link below:</p>
    <p><a href="http://localhost:8081/auth/confirm-email-change/${emailChangeToken}" style="color: #4CAF50;">Confirm Email Change</a></p>
  `;

  const mailOptions = {
    from: `"IFTTT" <${process.env.EMAIL}>`,
    to: email,
    subject: "[IFTTT] Please confirm your email change",
    html: generateMailTemplate(bodyContent)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendPasswordResetMail = async (email, resetToken) => {
  const bodyContent = `
    <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
    <p>Please click on the link below to complete the process within one hour of receiving it:</p>
    <p><a href="http://localhost:8080/reset/password/${resetToken}" style="color: #4CAF50;">Reset Your Password</a></p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "[IFTTT] Password Reset Request",
    html: generateMailTemplate(bodyContent)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendEmailChangeConfirmationMail,
  sendConfirmationMail,
  sendPasswordResetMail,
};
