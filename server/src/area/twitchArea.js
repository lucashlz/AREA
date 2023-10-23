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
