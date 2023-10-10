const { google } = require("googleapis");
const User = require("../models/userModels");

async function setYouTubeToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.youtube) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "http://localhost:8080/connect/google/callback"
        );

        oauth2Client.setCredentials({ access_token: user.connectServices.youtube.access_token });
        return google.youtube({ version: "v3", auth: oauth2Client });
    } else {
        throw new Error("Failed to set YouTube token for user.");
    }
}

async function newLikedVideo(userId) {
    const youtube = await setYouTubeToken(userId);
    const response = await youtube.activities.list({
        part: "snippet",
        mine: true,
        maxResults: 1,
        type: "like",
    });
    return response.data.items.length > 0 ? response.data.items[0] : null;
}

async function newVideoByChannel(userId, channelId) {
    const youtube = await setYouTubeToken(userId);
    const response = await youtube.search.list({
        part: "snippet",
        channelId: channelId,
        maxResults: 1,
        order: "date",
    });
    return response.data.items.length > 0 ? response.data.items[0] : null;
}

async function newSubscription(userId, channelId) {
    const youtube = await setYouTubeToken(userId);
    const response = await youtube.subscriptions.list({
        part: "snippet",
        channelId: channelId,
        maxResults: 1,
    });
    return response.data.items.length > 0 ? response.data.items[0] : null;
}

async function likeVideo(userId, videoId) {
    const youtube = await setYouTubeToken(userId);
    return youtube.videos.rate({
        id: videoId,
        rating: "like",
    });
}

module.exports = {
    newLikedVideo,
    newVideoByChannel,
    newSubscription,
    likeVideo,
};
