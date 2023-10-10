const OAuthSession = require("../models/OAuthSession");
const User = require("../models/userModels");

async function registerOAuthSession(userId, service) {
    try {
        const oAuthSession = await OAuthSession.create({
            userId,
            service,
        });
        return oAuthSession._id.toString();
    } catch (err) {
        console.error("Failed to create OAuthSession:", err);
        return null;
    }
}

async function verifyOAuthSession(sessionId, service) {
    try {
        const oAuthSession = await OAuthSession.findByIdAndDelete(sessionId);
        if (oAuthSession?.service === service) {
            const user = await User.findById(oAuthSession.userId);
            return {
                user,
            };
        }
        console.error("Invalid OAuthSession.");
    } catch (err) {
        console.error("Failed to verify OAuthSession:", err);
    }
    return { user: null };
}

module.exports = {
    registerOAuthSession,
    verifyOAuthSession,
};
