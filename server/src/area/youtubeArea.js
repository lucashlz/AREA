const { google } = require("googleapis");
const User = require("../models/userModels");

async function setYouTubeToken(userId) {
    const user = await User.findById(userId);
    if (!user) {
        console.error("User not found:", userId);
        return null;
    }
    const youtubeService = user.connectServices.get("youtube");
    if (!youtubeService) {
        console.error("Youtube service not available for user:", user._id);
        return null;
    }
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:8080/connect/google/callback");
    oauth2Client.setCredentials({ access_token: youtubeService.access_token });
    return google.youtube({ version: "v3", auth: oauth2Client });
}

async function processTriggerData(areaEntry, key, value) {
    if (!areaEntry.trigger.data) {
        areaEntry.trigger.data = { key, value };
        await areaEntry.save();
        return false;
    } else if (areaEntry.trigger.data.value !== value) {
        areaEntry.trigger.data = { key, value };
        await areaEntry.save();
        return true;
    }
    return false;
}

function updateOrPushIngredient(ingredients, ingredient) {
    const index = ingredients.findIndex((item) => item.name === ingredient.name);
    if (index !== -1) {
        ingredients[index].value = ingredient.value;
    } else {
        ingredients.push(ingredient);
    }
}
async function newLikedVideo(areaEntry) {
    const youtube = await setYouTubeToken(areaEntry.userId);
    const channelResponse = await youtube.channels.list({
        part: "contentDetails",
        mine: true,
        maxResults: 1,
    });
    const likedVideosPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.likes;
    const response = await youtube.playlistItems.list({
        part: "snippet",
        playlistId: likedVideosPlaylistId,
        maxResults: 1,
    });
    const recentLike = response.data.items.length > 0 ? response.data.items[0].snippet : null;
    if (!recentLike) return false;

    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_video_title", value: recentLike.title });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_channel_name", value: recentLike.channelTitle });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_video_url", value: `https://www.youtube.com/watch?v=${recentLike.resourceId.videoId}` });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_published_date", value: recentLike.publishedAt });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_video_description", value: recentLike.description });
    return await processTriggerData(areaEntry, "videoId", recentLike.resourceId.videoId);
}

async function newVideoByChannel(areaEntry) {
    const channelId = areaEntry.trigger.parameters[0].input;
    const youtube = await setYouTubeToken(areaEntry.userId);
    const response = await youtube.search.list({
        part: "snippet",
        channelId: channelId,
        maxResults: 1,
        order: "date",
    });
    const recentVideo = response.data.items.length > 0 ? response.data.items[0].snippet : null;
    if (!recentVideo) return false;

    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_video_title", value: recentVideo.title });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_channel_name", value: recentVideo.channelTitle });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_video_url", value: `https://www.youtube.com/watch?v=${recentVideo.resourceId.videoId}` });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_published_date", value: recentVideo.publishedAt });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_video_description", value: recentVideo.description });
    return await processTriggerData(areaEntry, "videoId", recentVideo.resourceId.videoId);
}

async function newSubscription(areaEntry) {
    const youtube = await setYouTubeToken(areaEntry.userId);
    const response = await youtube.subscriptions.list({
        part: "snippet",
        mine: true,
        maxResults: 1,
    });
    const recentSubscription = response.data.items.length > 0 ? response.data.items[0].snippet : null;
    if (!recentSubscription) return false;

    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_channel_name", value: recentSubscription.channelTitle });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_channel_url", value: `https://www.youtube.com/channel/${recentSubscription.channelId}` });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "youtube_subscribed_date", value: recentSubscription.publishedAt });
    return await processTriggerData(areaEntry, "subscriptionId", recentSubscription.channelId);
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
