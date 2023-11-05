const { getYouTubeToken } = require("../../token/servicesTokenUtils");

async function checkExists(youtube, type, id) {
    try {
        const response = await youtube[type].list({
            id,
            part: "id",
            maxResults: 1,
        });
        return response.data.items.length > 0;
    } catch {
        return false;
    }
}

exports.checkYoutubeParameters = async function(userId, parameters, actionName) {
    const youtube = await getYouTubeToken(userId);

    if (actionName === "like_video" && parameters.some((param) => param.input.startsWith("<") && param.input.endsWith(">"))) {
        throw new Error(`Ingredients wrapped in <> are not allowed for the ${actionName} action.`);
    }
    for (let param of parameters) {
        if (param.name === "channel_id" && !(await checkExists(youtube, "channels", param.input))) {
            throw new Error(`Invalid channel ID provided`);
        }
        if (param.name === "video_id" && !(await checkExists(youtube, "videos", param.input))) {
            throw new Error(`Invalid video ID provided`);
        }
    }
    return true;
}
