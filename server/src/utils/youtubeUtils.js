const { google } = require("googleapis");
const User = require("../models/userModels");

async function setYouTubeToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.get("youtube")) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "http://localhost:8080/connect/google/callback"
        );

        oauth2Client.setCredentials({ access_token: user.connectServices.get("youtube").access_token });
        return google.youtube({ version: "v3", auth: oauth2Client });
    } else {
        throw new Error("Failed to set YouTube token for user.");
    }
}

async function checkChannelExists(youtube, channelId) {
    try {
        const response = await youtube.channels.list({
            id: channelId,
            part: "id",
            maxResults: 1,
        });
        return response.data.items.length > 0;
    } catch {
        return false;
    }
}

async function checkVideoExists(youtube, videoId) {
    try {
        const response = await youtube.videos.list({
            id: videoId,
            part: "id",
            maxResults: 1,
        });
        return response.data.items.length > 0;
    } catch {
        return false;
    }
}

async function checkYoutubeParameters(userId, parameters) {
    const youtube = await setYouTubeToken(userId);

    for (let param of parameters) {
        if (param.name === "channel_id" && !(await checkChannelExists(youtube, param.input))) {
            throw new Error(`Invalid channel ID provided: ${param.input}`);
        }
        if (param.name === "video_id" && !(await checkVideoExists(youtube, param.input))) {
            throw new Error(`Invalid video ID provided: ${param.input}`);
        }
    }
    return true;
}

module.exports = {
    checkYoutubeParameters,
};
