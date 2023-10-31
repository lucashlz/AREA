const User = require("../models/userModels");
const axios = require("axios");
const qs = require("qs");

async function refreshTokensForAllUsers() {
    try {
        const users = await User.find();
        for (const user of users) {
            await refreshAllServiceTokens(user._id);
        }
    } catch (error) {
        console.error("Error while refreshing tokens for all users:", error);
    }
}

function isTokenExpired(user, serviceName) {
    console.log(`Checking token expiration for user: ${user._id} and service: ${serviceName}`);
    const serviceData = user.connectServices.get(serviceName);
    if (!serviceData) {
        console.log(`No service data found for user: ${user._id} and service: ${serviceName}.`);
        return false;
    }
    const tokenIssuedAt = serviceData.tokenIssuedAt;
    if (!tokenIssuedAt) {
        console.log(`No tokenIssuedAt found for user: ${user._id} and service: ${serviceName}. Assuming token is expired.`);
        return true;
    }
    const expiresIn = serviceData.expires_in;
    if (!expiresIn) {
        console.log(`No expiresIn found for user: ${user._id} and service: ${serviceName}. Assuming token is expired.`);
        return true;
    }
    const currentAdjustedTime = Date.now();
    console.log(`Current time (ms since epoch): ${currentAdjustedTime}`);
    console.log(`tokenIssuedAt (ms since epoch): ${tokenIssuedAt}`);
    const timeElapsed = currentAdjustedTime - tokenIssuedAt;
    const isExpired = timeElapsed >= expiresIn;
    console.log(
        `For user: ${user._id} and service: ${serviceName}, token issued at: ${new Date(
            tokenIssuedAt
        ).toISOString()}, expiresIn: ${expiresIn}ms, time elapsed: ${timeElapsed}ms, isExpired: ${isExpired}`
    );
    return isExpired;
}

async function refreshServiceTokenForUser(user, serviceName, refreshTokenFunction) {
    const serviceData = user.connectServices.get(serviceName);
    if (!serviceData) {
        console.warn(`No service data found for user ${user._id} and service ${serviceName}`);
        return;
    }
    const refreshToken = serviceData.refresh_token;
    if (!refreshToken) {
        console.warn(`No refresh token found for user ${user._id} and service ${serviceName}`);
        return;
    }
    const newAccessToken = await refreshTokenFunction(refreshToken);
    user.connectServices.get(serviceName).access_token = newAccessToken;
    user.connectServices.get(serviceName).tokenIssuedAt = Date.now();
    await user.save();
    console.log(`Refreshed ${serviceName} token for user ${user._id}`);
}

async function refreshAllServiceTokens(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");
    const services = [
        { name: "spotify", refreshFunction: refreshSpotifyToken },
        { name: "youtube", refreshFunction: refreshGoogleToken },
        { name: "gmail", refreshFunction: refreshGoogleToken },
        { name: "twitch", refreshFunction: refreshTwitchToken },
        { name: "dropbox", refreshFunction: refreshDropboxToken },
    ];
    for (let service of services) {
        if (isTokenExpired(user, service.name)) {
            await refreshServiceTokenForUser(user, service.name, service.refreshFunction);
        }
    }
}

async function refreshSpotifyToken(refreshToken) {
    const data = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    };
    const response = await axios.post("https://accounts.spotify.com/api/token", qs.stringify(data), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return response.data.access_token;
}

async function refreshGoogleToken(refreshToken) {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
    });
    return response.data.access_token;
}

async function refreshTwitchToken(refreshToken) {
    const response = await axios.post("https://id.twitch.tv/oauth2/token", {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
    });
    return response.data.access_token;
}

async function refreshDropboxToken(refreshToken) {
    const data = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.DROPBOX_CLIENT_ID,
        client_secret: process.env.DROPBOX_CLIENT_SECRET,
    };
    const response = await axios.post("https://api.dropboxapi.com/oauth2/token", qs.stringify(data), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    if (response.data && response.data.access_token) {
        return response.data.access_token;
    } else {
        throw new Error("Failed to refresh Dropbox token");
    }
}

module.exports = {
    refreshTokensForAllUsers,
};
