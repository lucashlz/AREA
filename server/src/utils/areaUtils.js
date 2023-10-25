const axios = require("axios");

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

async function generateDescription(area) {
    const areaString = JSON.stringify(area, null, 2);
    const prompt = `i need you to generate a short description for area creation with little bit imagination, like for example if the user creates this area:
    {
        "_id": "",
        "trigger": {
          "service": "dateTime",
          "name": "every_day_at",
          "parameters": [
            {
              "name": "target_hour",
              "input": "18"
            },
            {
              "name": "target_minute",
              "input": "15"
            }
          ]
        },
        "isActive": true,
        "actions": [
          {
            "service": "spotify",
            "name": "follow_playlist",
            "parameters": [
              {
                "name": "playlist_id",
                "input": "1FGHap1L2xUZ057TnrmxIt"
              }
            ]
          }
        ]
      }
    Follow a Spotify playlist every days at 18h15 late in the afternoon
    or
    {
        "_id": "",
        "trigger": {
          "service": "spotify",
          "name": "new_recently_played_track",
          "parameters": []
        },
        "isActive": true,
        "actions": [
          {
            "service": "gmail",
            "name": "send_email",
            "parameters": [
              {
                "name": "to_address",
                "input": "patteinh@gmail.com lola@gmail.com"
              },
              {
                "name": "cc_address",
                "input": "patteinh@gmail.com"
              },
              {
                "name": "bcc_address",
                "input": "patteinh@gmail.com"
              },
              {
                "name": "subject",
                "input": "IFTTT"
              },
              {
                "name": "body",
                "input": "new spotify track was listen"
              },
              {
                "name": "attachment_url",
                "input": "https://fr.wiktionary.org/wiki/aa"
              }
            ]
          }
        ]
      }
    Send an email to patteinh@gmail.com and lola@gmail.com when a new spotify track was listen.
    now you need to provide description for:
    ${areaString}`;
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-002",
                prompt: prompt,
                max_tokens: 50,
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer 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`,
                },
            }
        );

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Error generating description:", error);
        throw error;
    }
}

const checkParameters = async (userId, trigger, actions) => {
    const checkParams = async (parameters, service, triggerName = null) => {
        if (Array.isArray(parameters)) {
            for (const param of parameters) {
                if (!param) {
                    continue;
                }
                if ((!param.name || !param.input) && !param.optional) {
                    throw new Error(`Parameter validation failed: missing name or input for parameter ${JSON.stringify(param)}`);
                }
            }
        } else {
            throw new Error(`Parameters is not an array: ${JSON.stringify(parameters)}`);
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
                throw error;
            }
        }
        return true;
    };
    try {
        if (!(await checkParams(trigger.parameters, trigger.service, trigger.name))) {
            throw new Error("Trigger parameter check failed");
        }
        for (const action of actions) {
            if (!(await checkParams(action.parameters, action.service))) {
                throw new Error("Action parameter check failed");
            }
        }
    } catch (error) {
        console.error(error.message);
        throw error;
    }
    return true;
};

module.exports = {
    checkParameters,
    generateDescription,
};
