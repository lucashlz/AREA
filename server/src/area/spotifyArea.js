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
    const songName = recentTrack.name;
    const artist = recentTrack.artists[0].name;
    const trackURL = recentTrack.external_urls.spotify;
    const coverURL = recentTrack.album.images[0].url;
    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    areaEntry.trigger.ingredients.push({ name: "song_name", value: songName });
    areaEntry.trigger.ingredients.push({ name: "artist", value: artist });
    areaEntry.trigger.ingredients.push({ name: "trackURL", value: trackURL });
    areaEntry.trigger.ingredients.push({ name: "coverURL", value: coverURL });
    return await processTriggerData(areaEntry, "trackId", recentTrack.id);
}

async function newSavedAlbum(areaEntry) {
    await setSpotifyToken(areaEntry.userId);
    const savedAlbum = await spotifyApi.getMySavedAlbums({ limit: 1 });
    const recentAlbum = savedAlbum.body.items.length > 0 ? savedAlbum.body.items[0].album : null;
    if (!recentAlbum) return false;
    const albumName = recentAlbum.name;
    const artist = recentAlbum.artists[0].name;
    const albumURL = recentAlbum.external_urls.spotify;
    const coverURL = recentAlbum.images[0].url;
    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    areaEntry.trigger.ingredients.push({ name: "album_name", value: albumName });
    areaEntry.trigger.ingredients.push({ name: "artist", value: artist });
    areaEntry.trigger.ingredients.push({ name: "albumURL", value: albumURL });
    areaEntry.trigger.ingredients.push({ name: "coverURL", value: coverURL });
    return await processTriggerData(areaEntry, "albumId", recentAlbum.id);
}

async function newRecentlyPlayedTrack(areaEntry) {
    await setSpotifyToken(areaEntry.userId);
    const recentlyPlayedTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
    const recentTrack = recentlyPlayedTracks.body.items.length > 0 ? recentlyPlayedTracks.body.items[0].track : null;
    if (!recentTrack) return false;
    const songName = recentTrack.name;
    const artist = recentTrack.artists[0].name;
    const trackURL = recentTrack.external_urls.spotify;
    const coverURL = recentTrack.album.images[0].url;
    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    areaEntry.trigger.ingredients.push({ name: "song_name", value: songName });
    areaEntry.trigger.ingredients.push({ name: "artist", value: artist });
    areaEntry.trigger.ingredients.push({ name: "trackURL", value: trackURL });
    areaEntry.trigger.ingredients.push({ name: "coverURL", value: coverURL });
    return await processTriggerData(areaEntry, "recentTrackId", recentTrack.id);
}

async function newTrackAddedToPlaylist(areaEntry) {
    const playlistId = areaEntry.trigger.parameters[0].input;
    await setSpotifyToken(areaEntry.userId);
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
    const artist = recentAddedTrack.artists[0].name;
    const trackURL = recentAddedTrack.external_urls.spotify;
    const coverURL = recentAddedTrack.album.images[0].url;
    if (!areaEntry.trigger.ingredients) {
        areaEntry.trigger.ingredients = [];
    }
    areaEntry.trigger.ingredients.push({ name: "song_name", value: songName });
    areaEntry.trigger.ingredients.push({ name: "artist", value: artist });
    areaEntry.trigger.ingredients.push({ name: "trackURL", value: trackURL });
    areaEntry.trigger.ingredients.push({ name: "coverURL", value: coverURL });
    return await processTriggerData(areaEntry, "newPlaylistTrackId", recentAddedTrack.id);
}

async function followPlaylist(userId, playlistId) {
    await setSpotifyToken(userId);
    return spotifyApi.followPlaylist(playlistId);
}

async function saveTrack(userId, trackId) {
    await setSpotifyToken(userId);
    return spotifyApi.addToMySavedTracks([trackId]);
}

async function addToPlaylistById(userId, playlistId, trackId) {
    await setSpotifyToken(userId);
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
