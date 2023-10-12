const { checkSpotifyParameters } = require("./spotifyUtils");

const serviceCheckFunctions = {
    spotify: checkSpotifyParameters,
};
const checkParameters = async (userId, trigger, actions) => {
    if (Array.isArray(trigger.parameters)) {
        for (const param of trigger.parameters) {
            if (!param.name || !param.input) {
                return false;
            }
        }
    } else {
        console.error("Trigger parameters is not an array:", trigger.parameters);
        return false;
    }

    if (serviceCheckFunctions[trigger.service]) {
        try {
            await serviceCheckFunctions[trigger.service](userId, trigger.parameters);
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }
    for (const action of actions) {
        if (Array.isArray(action.parameters)) {
            for (const param of action.parameters) {
                if (!param.name || !param.input) {
                    return false;
                }
            }
        } else {
            console.error("Action parameters is not an array for action:", action.name);
            return false;
        }

        if (serviceCheckFunctions[action.service]) {
            try {
                await serviceCheckFunctions[action.service](userId, action.parameters);
            } catch (error) {
                console.error(error.message);
                return false;
            }
        }
    }

    return true;
};

module.exports = {
    checkParameters,
};
