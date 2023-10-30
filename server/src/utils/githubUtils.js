const { Octokit } = require("@octokit/rest");
const User = require("../models/userModels");

const ALLOWED_INGREDIENTS_FOR_ACTIONS = {
    create_issue: {
        repository: ["repository_name"],
        title: [
            "commit_date",
            "committer_name",
            "commit_message",
            "repository_name",
            "issue_title",
            "issue_body",
            "issue_creator",
            "issue_date",
            "assigned_to_you_date",
            "repository_description",
            "repository_owner",
            "repository_date",
            "date",
            "day",
            "month",
            "year",
            "hour",
            "minute",
            "twitch_stream_title",
            "twitch_streamer_name",
            "twitch_viewers_count",
            "twitch_stream_started_at",
            "twitch_game_being_played",
            "twitch_channel_name",
            "twitch_channel_followers_count",
            "twitch_channel_total_views",
            "twitch_followed_date",
            "twitch_follower_username",
            "youtube_video_title",
            "youtube_channel_name",
            "youtube_published_date",
            "youtube_video_description",
            "youtube_subscribed_date"
        ],
        body: [
            "commit_date",
            "commit_url",
            "committer_name",
            "commit_message",
            "repository_name",
            "issue_title",
            "issue_body",
            "issue_creator",
            "issue_date",
            "assigned_to_you_date",
            "repository_description",
            "repository_owner",
            "repository_date",
            "repository_url",
            "issue_url",
            "date",
            "day",
            "month",
            "year",
            "hour",
            "minute",
            "twitch_stream_title",
            "twitch_streamer_name",
            "twitch_stream_url",
            "twitch_viewers_count",
            "twitch_stream_started_at",
            "twitch_game_being_played",
            "twitch_channel_name",
            "twitch_channel_url",
            "twitch_channel_followers_count",
            "twitch_channel_total_views",
            "twitch_followed_date",
            "twitch_follower_username",
            "twitch_follower_profile_url",
            "youtube_video_title",
            "youtube_channel_name",
            "youtube_video_url",
            "youtube_published_date",
            "youtube_video_description",
            "youtube_subscribed_date"
        ],
    },
};

async function setGitHubToken(user) {
    const githubService = user.connectServices.get("github");
    if (!githubService) {
        console.error("GitHub service not available for user:", user._id);
        throw new Error("GitHub service not connected for user.");
    }
    const octokit = new Octokit({ auth: githubService.access_token });
    return octokit;
}

async function checkRepositoryExists(user, repoName) {
    const octokit = await setGitHubToken(user);
    try {
        await octokit.repos.get({
            owner: user.connectServices.get("github").data.login,
            repo: repoName,
        });
        console.log(`Repository ${repoName} is valid.`);
        return true;
    } catch (error) {
        console.log(`Repository ${repoName} is invalid.`, error);
        return false;
    }
}

function isIngredient(input) {
    return input.startsWith("<") && input.endsWith(">");
}

async function checkGithubParameters(userId, parameters, actionName) {
    const user = await User.findById(userId);
    if (actionName === "create_issue") {
        for (let param of parameters) {
            const ingredientNamesInInput = (param.input.match(/<([^>]+)>/g) || []).map((ingredient) => ingredient.slice(1, -1));

            for (const ingredientName of ingredientNamesInInput) {
                const allowedIngredients = ALLOWED_INGREDIENTS_FOR_ACTIONS[actionName][param.name];
                if (!allowedIngredients || !allowedIngredients.includes(ingredientName)) {
                    throw new Error(`Invalid ingredient: ${ingredientName} for parameter: ${param.name} in action: ${actionName}`);
                }
            }
        }
    }
    for (let param of parameters) {
        switch (param.name) {
            case "repository":
                if (!isIngredient(param.input) && !(await checkRepositoryExists(user, param.input))) {
                    throw new Error(`Invalid repository name ${param.input} provided`);
                }
                break;
            case "title":
                if (!isIngredient(param.input) && (!param.input || param.input.trim() === "")) {
                    throw new Error(`Invalid ${param.name} provided`);
                }
                break;
            case "body":
                if (!isIngredient(param.input) && (!param.input || param.input.trim() === "")) {
                    throw new Error(`Invalid ${param.name} provided`);
                }
                break;
            default:
                break;
        }
    }
    return true;
}

module.exports = {
    checkGithubParameters,
};
