const axios = require("axios");
const User = require("../models/userModels");

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

async function streamGoingLiveForChannel(areaEntry) {
    try {
        const user = await User.findById(areaEntry.userId);
        if (!user || !user.connectServices || !user.connectServices.get("twitch")) {
            throw new Error(`Failed to fetch Twitch details for user with ID ${areaEntry.userId}`);
        }
        const userAccessToken = user.connectServices.get("twitch").access_token;
        const twitchUserId = user.connectServices.get("twitch").data.id;
        let cursor;
        let allFollowedLiveStreams = [];
        do {
            const liveStreamsResponse = await axios.get("https://api.twitch.tv/helix/streams/followed", {
                headers: {
                    Authorization: `Bearer ${userAccessToken}`,
                    "Client-Id": process.env.TWITCH_CLIENT_ID,
                },
                params: {
                    user_id: twitchUserId,
                    first: 100,
                    after: cursor,
                },
            });
            allFollowedLiveStreams = allFollowedLiveStreams.concat(liveStreamsResponse.data.data);
            cursor = liveStreamsResponse.data.pagination && liveStreamsResponse.data.pagination.cursor;
        } while (cursor);
        const isChannelLive = allFollowedLiveStreams.some((stream) => {
            return stream && typeof stream.user_name === "string" && stream.user_name.toLowerCase() === areaEntry.trigger.parameters[0].input.toLowerCase();
        });
        if (!areaEntry.trigger.data) {
            await processTriggerData(areaEntry, "streamStatus", false);
        }
        if (isChannelLive) {
            const liveStream = allFollowedLiveStreams.find((stream) => stream.user_name.toLowerCase() === areaEntry.trigger.parameters[0].input.toLowerCase());
            updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_stream_title", value: liveStream.title });
            updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_streamer_name", value: liveStream.user_name });
            updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_stream_url", value: `https://www.twitch.tv/${liveStream.user_name}` });
            updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_viewers_count", value: liveStream.viewer_count.toString() });
            updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_stream_started_at", value: liveStream.started_at });
            updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_game_being_played", value: liveStream.game_name });
            return await processTriggerData(areaEntry, "streamStatus", true);
        } else {
            return await processTriggerData(areaEntry, "streamStatus", false);
        }
    } catch (error) {
        console.error("Error checking if channel is live:", error);
        throw error;
    }
}

async function youFollowNewChannel(areaEntry) {
    const user = await User.findById(areaEntry.userId);
    if (!user || !user.connectServices || !user.connectServices.get("twitch")) {
        throw new Error(`Failed to fetch Twitch details for user with ID ${areaEntry.userId}`);
    }
    const userAccessToken = user.connectServices.get("twitch").access_token;
    const twitchUserId = user.connectServices.get("twitch").data.id;
    try {
        const response = await axios.get("https://api.twitch.tv/helix/channels/followed", {
            headers: {
                Authorization: `Bearer ${userAccessToken}`,
                "Client-Id": process.env.TWITCH_CLIENT_ID,
            },
            params: {
                user_id: twitchUserId,
            },
        });
        const followedChannels = response.data.data;
        const newFollowedChannel = followedChannels[0];
        if (!newFollowedChannel) return false;
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_channel_name", value: newFollowedChannel.broadcaster_name });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_channel_url", value: `https://www.twitch.tv/${newFollowedChannel.broadcaster_name}` });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_channel_followers_count", value: newFollowedChannel.broadcaster_followers_count.toString() });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_channel_total_views", value: newFollowedChannel.broadcaster_views_count.toString() });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_followed_date", value: newFollowedChannel.followed_date });
        return await processTriggerData(areaEntry, "followedChannelId", newFollowedChannel.broadcaster_id);
    } catch (error) {
        console.error("Error fetching followed channels:", error);
        throw error;
    }
}

async function newFollowerOnYourChannel(areaEntry) {
    const user = await User.findById(areaEntry.userId);
    if (!user || !user.connectServices || !user.connectServices.get("twitch")) {
        throw new Error(`Failed to fetch Twitch details for user with ID ${areaEntry.userId}`);
    }
    const userAccessToken = user.connectServices.get("twitch").access_token;
    const twitchUserId = user.connectServices.get("twitch").data.id;
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${twitchUserId}`, {
            headers: {
                Authorization: `Bearer ${userAccessToken}`,
                "Client-Id": process.env.TWITCH_CLIENT_ID,
            },
        });
        const followers = response.data.data;
        const newFollower = followers[0];
        if (!newFollower) return false;
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_follower_username", value: newFollower.user_name });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_follower_profile_url", value: `https://www.twitch.tv/${newFollower.user_name}` });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "twitch_followed_date", value: newFollower.followed_date });
        const hasNewFollower = await processTriggerData(areaEntry, "followerId", newFollower.user_id);
        user.lastFollowers = followers.map((follower) => follower.user_id);
        await user.save();
        if (hasNewFollower) {
            return newFollower;
        }
        return false;
    } catch (error) {
        console.error("Error fetching followers for channel:", error);
        throw error;
    }
}

module.exports = {
    streamGoingLiveForChannel,
    youFollowNewChannel,
    newFollowerOnYourChannel,
};
