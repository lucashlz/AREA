const { makeApiCall } = require("./apiUtils");

exports.fetchLiveStreams = async function (userAccessToken, twitchUserId) {
    const url = "https://api.twitch.tv/helix/streams/followed";
    const headers = {
        "Client-Id": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${userAccessToken}`,
    };
    const params = {
        user_id: twitchUserId,
    };

    try {
        const response = await makeApiCall(url, "GET", headers, params);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch live streams:", error);
        throw error;
    }
};

exports.fetchAllFollowedChannels = async function (userAccessToken, twitchUserId) {
    const url = `https://api.twitch.tv/helix/users/follows`;
    let allFollowedChannels = [];
    let cursor = null;

    try {
        while (true) {
            const headers = {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${userAccessToken}`,
            };
            const params = { from_id: twitchUserId, ...(cursor && { after: cursor }) };
            const response = await makeApiCall(url, "GET", headers, params);
            allFollowedChannels = allFollowedChannels.concat(response.data);
            cursor = response.pagination.cursor;
            if (!cursor) {
                break;
            }
        }

        return allFollowedChannels;
    } catch (error) {
        console.error("Failed to get all followed channels:", error);
        throw error;
    }
};

exports.fetchAllFollowers = async function (userAccessToken, twitchUserId) {
    const url = `https://api.twitch.tv/helix/users/follows`;
    let allFollowers = [];
    let cursor = null;

    try {
        while (true) {
            const headers = {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${userAccessToken}`,
            };
            const params = { to_id: twitchUserId, ...(cursor && { after: cursor }) };
            const response = await makeApiCall(url, "GET", headers, params);
            allFollowers = allFollowers.concat(response.data);
            cursor = response.pagination.cursor;
            if (!cursor) {
                break;
            }
        }

        return allFollowers;
    } catch (error) {
        console.error("Failed to get all followers:", error);
        throw error;
    }
};
