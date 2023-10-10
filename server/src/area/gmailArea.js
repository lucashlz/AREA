const { google } = require("googleapis");
const User = require("../models/userModels");
const axios = require("axios");
const { Buffer } = require("buffer");

async function setGmailToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.gmail) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "http://localhost:8080/connect/google/callback"
        );
        oauth2Client.setCredentials({ access_token: user.connectServices.gmail.access_token });
        return google.gmail({ version: "v1", auth: oauth2Client });
    } else {
        throw new Error("Failed to set Gmail token for user.");
    }
}

async function sendEmail(userId, to, cc, bcc, subject, body, attachmentUrl) {
    const gmail = await setGmailToken(userId);
    let emailLines = [];
    emailLines.push(`To: ${to}`);
    if (cc) emailLines.push(`Cc: ${cc}`);
    if (bcc) emailLines.push(`Bcc: ${bcc}`);
    emailLines.push(`Subject: ${subject}`);
    emailLines.push("");
    emailLines.push(body);

    if (attachmentUrl) {
        const attachment = await axios.get(attachmentUrl, { responseType: "arraybuffer" });
        const base64Data = Buffer.from(attachment.data).toString("base64");
        emailLines.push("--foo_bar_baz");
        emailLines.push(`Content-Type: ${attachment.headers["content-type"]}`);
        emailLines.push("Content-Transfer-Encoding: base64");
        emailLines.push("");
        emailLines.push(base64Data);
    }

    const email = emailLines.join("\r\n").trim();

    const raw = Buffer.from(email).toString("base64");
    return gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: raw,
        },
    });
}

async function sendEmailToSelf(userId, subject, body, attachmentUrl) {
    const user = await User.findById(userId);
    if (user && user.email) {
        return sendEmail(userId, user.email, null, null, subject, body, attachmentUrl);
    } else {
        throw new Error("User email not found.");
    }
}

module.exports = {
    sendEmail,
    sendEmailToSelf,
};
