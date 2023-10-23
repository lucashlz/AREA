const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");
const User = require("../models/userModels");

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);

async function setTwitchToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.get("twitch")) {
        const accessToken = user.connectServices.get("twitch").access_token;
        return new ApiClient({ authProvider, accessToken });
    } else {
        throw new Error("Failed to set Twitch token for user.");
    }
}

async function checkChannelExists(apiClient, channelName) {
    try {
        const user = await apiClient.helix.users.getUserByName(channelName);
        return !!user;
    } catch {
        return false;
    }
}

async function checkUserExists(apiClient, userName) {
    try {
        const user = await apiClient.helix.users.getUserByName(userName);
        return !!user;
    } catch {
        return false;
    }
}

async function checkTwitchParameters(userId, parameters) {
    const twitchApiClient = await setTwitchToken(userId);

    for (let param of parameters) {
        if (
            param.name === "channel_name" &&
            !(await checkChannelExists(twitchApiClient, param.input))
        ) {
            throw new Error("Invalid channel name provided");
        }
        if (param.name === "user_name" && !(await checkUserExists(twitchApiClient, param.input))) {
            throw new Error("Invalid user name provided");
        }
    }

    return true;
}

module.exports = {
    checkTwitchParameters,
};
