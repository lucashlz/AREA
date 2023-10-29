const SpotifyWebApi = require("spotify-web-api-node");
const User = require("../models/userModels");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:8080/connect/spotify/callback",
});

async function setSpotifyToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.get("spotify")) {
        spotifyApi.setAccessToken(user.connectServices.get("spotify").access_token);
    } else {
        throw new Error("Failed to set Spotify token for user.");
    }
}

function updateOrPushIngredient(ingredients, ingredient) {
    const index = ingredients.findIndex((item) => item.name === ingredient.name);
    if (index !== -1) {
        ingredients[index].value = ingredient.value;
    } else {
        ingredients.push(ingredient);
    }
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

async function newSavedTrack(areaEntry) {
    await setSpotifyToken(areaEntry.userId);
    const savedTrack = await spotifyApi.getMySavedTracks({ limit: 1 });
    const recentTrack = savedTrack.body.items.length > 0 ? savedTrack.body.items[0].track : null;
    if (!recentTrack) return false;
    const songId = recentTrack.id;
    const songName = recentTrack.name;
    const artist = recentTrack.artists[0].name;
    const trackURL = recentTrack.external_urls.spotify;
    const coverURL = recentTrack.album.images[0].url;
    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "song_name", value: songName });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "song_id", value: songId });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "artist", value: artist });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "trackURL", value: trackURL });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "coverURL", value: coverURL });
    return await processTriggerData(areaEntry, "trackId", recentTrack.id);
}

async function newSavedAlbum(areaEntry) {
    await setSpotifyToken(areaEntry.userId);
    const savedAlbum = await spotifyApi.getMySavedAlbums({ limit: 1 });
    const recentAlbum = savedAlbum.body.items.length > 0 ? savedAlbum.body.items[0].album : null;
    if (!recentAlbum) return false;
    const albumName = recentAlbum.name;
    const albumId = recentAlbum.id;
    const artist = recentAlbum.artists[0].name;
    const albumURL = recentAlbum.external_urls.spotify;
    const coverURL = recentAlbum.images[0].url;
    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "album_name", value: albumName });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "album_id", value: albumId });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "artist", value: artist });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "albumURL", value: albumURL });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "coverURL", value: coverURL });
    return await processTriggerData(areaEntry, "albumId", recentAlbum.id);
}

async function newRecentlyPlayedTrack(areaEntry) {
    await setSpotifyToken(areaEntry.userId);
    const recentlyPlayedTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
    const recentTrack = recentlyPlayedTracks.body.items.length > 0 ? recentlyPlayedTracks.body.items[0].track : null;
    if (!recentTrack) return false;
    const songName = recentTrack.name;
    const songId = recentTrack.id;
    const artist = recentTrack.artists[0].name;
    const trackURL = recentTrack.external_urls.spotify;
    const coverURL = recentTrack.album.images[0].url;
    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "song_name", value: songName });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "song_id", value: songId });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "artist", value: artist });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "trackURL", value: trackURL });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "coverURL", value: coverURL });
    return await processTriggerData(areaEntry, "recentTrackId", recentTrack.id);
}

async function newTrackAddedToPlaylist(areaEntry) {
    const playlistId = areaEntry.trigger.parameters[0].input;
    await setSpotifyToken(areaEntry.userId);
    const playlistDetails = await spotifyApi.getPlaylist(playlistId);
    const playlistName = playlistDetails.body.name;
    const initialFetch = await spotifyApi.getPlaylistTracks(playlistId, { limit: 1 });
    const totalTracks = initialFetch.body.total;
    const limit = 100;
    const offset = totalTracks - (totalTracks % limit);
    const tracksInPlaylist = await spotifyApi.getPlaylistTracks(playlistId, { limit: limit, offset: offset });
    if (!tracksInPlaylist || tracksInPlaylist.body.items.length === 0) {
        console.error("No tracks found in the specified playlist");
        return false;
    }
    const recentAddedTrack = tracksInPlaylist.body.items[tracksInPlaylist.body.items.length - 1].track;
    const songName = recentAddedTrack.name;
    const songId = recentAddedTrack.id;
    const artist = recentAddedTrack.artists[0].name;
    const trackURL = recentAddedTrack.external_urls.spotify;
    const coverURL = recentAddedTrack.album.images[0].url;
    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "song_name", value: songName });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "song_id", value: songId });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "playlist_name", value: playlistName });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "playlist_id", value: playlistId });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "artist", value: artist });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "trackURL", value: trackURL });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "coverURL", value: coverURL });
    return await processTriggerData(areaEntry, "newPlaylistTrackId", recentAddedTrack.id);
}

async function followPlaylist(userId, playlistId, ingredients) {
    await setSpotifyToken(userId);
    if (playlistId.startsWith("<") && playlistId.endsWith(">") && ingredients) {
        const ingredientName = playlistId.slice(1, -1);
        const ingredient = ingredients.find((ing) => ing.name === ingredientName);
        if (ingredient) {
            playlistId = ingredient.value;
        }
    }
    return spotifyApi.followPlaylist(playlistId);
}

async function saveTrack(userId, trackId, ingredients) {
    await setSpotifyToken(userId);
    if (trackId.startsWith("<") && trackId.endsWith(">") && ingredients) {
        const ingredientName = trackId.slice(1, -1);
        const ingredient = ingredients.find((ing) => ing.name === ingredientName);
        if (ingredient) {
            trackId = ingredient.value;
        }
    }
    return spotifyApi.addToMySavedTracks([trackId]);
}

async function addToPlaylistById(userId, playlistId, trackId, ingredients) {
    await setSpotifyToken(userId);
    if (trackId.startsWith("<") && trackId.endsWith(">") && ingredients) {
        const ingredientName = trackId.slice(1, -1);
        const ingredient = ingredients.find((ing) => ing.name === ingredientName);
        if (ingredient) {
            trackId = ingredient.value;
        }
    }
    return spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${trackId}`]);
}

module.exports = {
    newSavedTrack,
    newSavedAlbum,
    newRecentlyPlayedTrack,
    newTrackAddedToPlaylist,
    followPlaylist,
    addToPlaylistById,
    saveTrack,
};
