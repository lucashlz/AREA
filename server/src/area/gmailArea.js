const { google } = require("googleapis");
const User = require("../models/userModels");
const { Buffer } = require("buffer");

async function setGmailToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.get("gmail")) {
        const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:8080/connect/google/callback");
        oauth2Client.setCredentials({ access_token: user.connectServices.get("gmail").access_token });
        return google.gmail({ version: "v1", auth: oauth2Client });
    } else {
        throw new Error("Failed to set Gmail token for user.");
    }
}

function replacePlaceholdersWithIngredients(content, ingredientsMapping, isSubject = false) {
    for (const [key, value] of Object.entries(ingredientsMapping)) {
        const placeholder = `<${key}>`;
        if (isSubject) {
            content = content.replace(new RegExp(placeholder, "g"), value);
        } else {
            const isURL = value.startsWith("http://") || value.startsWith("https://");
            content = content.replace(new RegExp(placeholder, "g"), isURL ? value : `<strong>${value}</strong>`);
        }
    }
    return content;
}

async function sendEmail(userId, to, cc, bcc, subject, body, attachmentUrl, ingredients = null) {
    const gmail = await setGmailToken(userId);
    if (ingredients) {
        const ingredientsMapping = {};
        for (const ingredient of ingredients) {
            ingredientsMapping[ingredient.name] = ingredient.value;
        }
        subject = replacePlaceholdersWithIngredients(subject, ingredientsMapping, true);
        body = replacePlaceholdersWithIngredients(body, ingredientsMapping);
        if (attachmentUrl) {
            attachmentUrl = replacePlaceholdersWithIngredients(attachmentUrl, ingredientsMapping);
        }
    }
    to = to.split(/[\s,]+/);
    cc = cc && cc.trim() ? cc.split(/[\s,]+/) : [];
    bcc = bcc && bcc.trim() ? bcc.split(/[\s,]+/) : [];
    let emailLines = [];
    const boundary = "foo_bar_baz";
    const iftttLogoUrl = "https://images.ctfassets.net/mrsnpomeucef/4FcLBcGJLV3Tru34MImgA3/3a4c836ebf29d4363c4a172e62ee5e80/Wordmark_on_gray.png";
    emailLines.push(`To: ${to.join(", ")}`);
    if (cc.length > 0) emailLines.push(`Cc: ${cc.join(", ")}`);
    if (bcc.length > 0) emailLines.push(`Bcc: ${bcc.join(", ")}`);
    emailLines.push(`Subject: ${subject}`);
    emailLines.push(`Content-Type: multipart/alternative; boundary=${boundary}`);
    emailLines.push("");
    emailLines.push(`--${boundary}`);
    emailLines.push("Content-Type: text/html; charset=ISO-8859-1");
    emailLines.push("");
    emailLines.push(`<div style="font-family: 'Archivo', Arial, sans-serif; padding: 40px; font-size: 16px; background-color: #f5f5f5;">`);
    emailLines.push(`<div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">`);
    emailLines.push(`<div style="text-align: center; margin-bottom: 30px;">`);
    emailLines.push(`<img src="${iftttLogoUrl}" alt="IFTTT Logo" style="max-width: 250px; border: none;">`);
    emailLines.push(`</div>`);
    emailLines.push(`<div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">`);
    emailLines.push(`<p style="font-size: 20px;">${body}</p>`);
    emailLines.push(`</div>`);
    if (attachmentUrl && attachmentUrl.trim()) {
        const isImageURL = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(attachmentUrl) || attachmentUrl.startsWith("https://i.scdn.co/image/");
        if (isImageURL) {
            emailLines.push(`<div style="text-align: center; margin-bottom: 30px;">`);
            emailLines.push(`<img src="${attachmentUrl}" alt="Attachment Image" style="max-width: 100%; border: none; border-radius: 5px;">`);
            emailLines.push(`</div>`);
        } else {
            emailLines.push(`<div style="text-align: center; margin-bottom: 30px;">`);
            emailLines.push(
                `<a href="${attachmentUrl}" style="display: inline-block; padding: 12px 20px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px; font-weight: bold;">View Attachment</a>`
            );
            emailLines.push(`</div>`);
        }
    }
    emailLines.push(`<div style="text-align: center; margin-bottom: 30px;">`);
    emailLines.push(
        `<h2 style="font-weight: bold; font-size: 24px; margin-bottom: 10px;"><a href="http://localhost:8081/" style="color: #4CAF50; text-decoration: none;">Visit IFTTT Website</a></h2>`
    );
    emailLines.push(`<p style="font-weight: bold; color: #666666;">14-16 Rue Voltaire, 94270 Le Kremlin-Bicêtre</p>`);
    emailLines.push(`</div>`);
    emailLines.push(`</div>`);
    emailLines.push(`<div style="padding-top: 30px; text-align: center;">`);
    emailLines.push(
        `<p style="color: #999999;">&copy; ${new Date().getFullYear()} IFTTT. All rights reserved. <a href="http://localhost:8081/privacy-policy" style="color: #4CAF50; text-decoration: none;">Privacy Policy</a></p>`
    );
    emailLines.push(`</div>`);
    emailLines.push(`</div>`);
    emailLines.push(`--${boundary}--`);
    const email = emailLines.join("\r\n").trim();
    const raw = Buffer.from(email).toString("base64");
    return gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: raw,
        },
    });
}

async function sendEmailToSelf(userId, subject, body, attachmentUrl, ingredients) {
    const user = await User.findById(userId);
    if (user && user.email) {
        return sendEmail(userId, user.email, null, null, subject, body, attachmentUrl, ingredients);
    } else {
        throw new Error("User email not found.");
    }
}

module.exports = {
    sendEmail,
    sendEmailToSelf,
};
