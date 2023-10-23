const axios = require("axios");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(emailString) {
    let emails = emailString.split(",").map((email) => email.trim());
    emails = emails.reduce((acc, email) => acc.concat(email.split(/\s+/)), []);
    return emails.every((email) => emailRegex.test(email));
}

async function checkGmailParameters(userId, parameters) {
    for (let param of parameters) {
        if (param.name === "to_address" && !isValidEmail(param.input)) {
            throw new Error("Invalid 'To' email address provided");
        }
        if (param.name === "cc_address" && param.input && !isValidEmail(param.input)) {
            throw new Error("Invalid 'CC' email address provided");
        }
        if (param.name === "bcc_address" && param.input && !isValidEmail(param.input)) {
            throw new Error("Invalid 'BCC' email address provided");
        }
        if (param.name === "attachment_url" && param.input) {
            try {
                const response = await axios.head(param.input);
                if (response.status !== 200) {
                    throw new Error();
                }
            } catch {
                throw new Error("Invalid attachment URL or the URL is not accessible");
            }
        }
        if (param.name === "subject" && (!param.input || param.input.trim() === "")) {
            throw new Error("Subject cannot be empty");
        }
        if (param.name === "body" && (!param.input || param.input.trim() === "")) {
            throw new Error("Body cannot be empty");
        }
    }
    return true;
}

module.exports = {
    checkGmailParameters,
};
