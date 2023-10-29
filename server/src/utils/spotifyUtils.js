const SpotifyWebApi = require("spotify-web-api-node");
const User = require("../models/userModels");

const ALLOWED_INGREDIENTS_FOR_ACTIONS = {
    "add_track_to_playlist_by_id": ["song_id"],
    "save_track": ["song_id"],
    "follow_playlist": []
};

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:8080/connect/spotify/callback",
});

async function checkPlaylistIdValid(user, playlistId) {
    const spotifyService = user.connectServices.get("spotify");
    if (!spotifyService) {
        console.error("Spotify service not available for user:", user._id);
        return false;
    }
    const spotifyToken = spotifyService.access_token;
    spotifyApi.setAccessToken(spotifyToken);
    try {
        await spotifyApi.getPlaylist(playlistId);
        console.log(`Playlist ID ${playlistId} is valid.`);
        return true;
    } catch (error) {
        console.log(`Playlist ID ${playlistId} is invalid.`, error);
        return false;
    }
}

async function checkTrackIdValid(user, trackId) {
    const spotifyService = user.connectServices.get("spotify");
    if (!spotifyService) {
        console.error("Spotify service not available for user:", user._id);
        return false;
    }
    const spotifyToken = spotifyService.access_token;
    spotifyApi.setAccessToken(spotifyToken);
    try {
        await spotifyApi.getTrack(trackId);
        console.log(`Track ID ${trackId} is valid.`);
        return true;
    } catch (error) {
        console.log(`Track ID ${trackId} is invalid.`);
        return false;
    }
}

function isIngredient(input) {
    return input.startsWith('<') && input.endsWith('>');
}

function getIngredientName(input) {
    if (isIngredient(input)) {
        return input.slice(1, -1);
    }
    return null;
}

async function checkSpotifyParameters(userId, parameters, actionName) {
    const user = await User.findById(userId);
    for (let param of parameters) {
        const ingredientName = getIngredientName(param.input);
        if (ingredientName) {
            const allowedIngredients = ALLOWED_INGREDIENTS_FOR_ACTIONS[actionName];
            if (!allowedIngredients.includes(ingredientName)) {
                throw new Error(`Invalid ingredient: ${ingredientName} for action: ${actionName}`);
            }
            continue;
        }
        if (param.name === "track_id" && !(await checkTrackIdValid(user, param.input))) {
            throw new Error("Invalid track ID provided");
        }
        if (param.name === "playlist_id" && !(await checkPlaylistIdValid(user, param.input))) {
            throw new Error("Invalid playlist ID provided");
        }
    }
    return true;
}

module.exports = {
    checkSpotifyParameters,
    checkTrackIdValid,
    checkPlaylistIdValid,
};
