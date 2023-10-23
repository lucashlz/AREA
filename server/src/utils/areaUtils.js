const { checkSpotifyParameters } = require("./spotifyUtils");
const { checkDatetimeParameters } = require("./datetimeUtils");
const { checkTwitchParameters } = require("./twitchUtils");
const { checkYoutubeParameters } = require("./youtubeUtils");
const { checkGmailParameters } = require("./gmailUtils");
const { checkGithubParameters } = require("./githubUtils");

const serviceCheckFunctions = {
    spotify: checkSpotifyParameters,
    dateTime: checkDatetimeParameters,
    twitch: checkTwitchParameters,
    github: checkGithubParameters,
    youtube: checkYoutubeParameters,
    gmail: checkGmailParameters,
};

const checkParameters = async (userId, trigger, actions) => {
    const checkParams = async (parameters, service, triggerName = null) => {
        if (Array.isArray(parameters)) {
            for (const param of parameters) {
                if ((!param.name || !param.input) && !param.optional) {
                    return false;
                }
            }
        } else {
            console.error("Parameters is not an array:", parameters);
            return false;
        }
        if (serviceCheckFunctions[service]) {
            try {
                console.log("Checking parameters:", JSON.stringify(parameters));
                if (service === "dateTime") {
                    await serviceCheckFunctions[service](triggerName, parameters);
                } else {
                    await serviceCheckFunctions[service](userId, parameters);
                }

            } catch (error) {
                console.error(error.message);
                return false;
            }
        }
        return true;
    };
    if (!(await checkParams(trigger.parameters, trigger.service, trigger.name))) {
        return false;
    }
    for (const action of actions) {
        if (!(await checkParams(action.parameters, action.service))) {
            return false;
        }
    }
    return true;
};

module.exports = {
    checkParameters,
};
