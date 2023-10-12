const SpotifyWebApi = require("spotify-web-api-node");
const User = require("../models/userModels");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:8080/connect/spotify/callback",
});

async function setSpotifyToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.spotify) {
        spotifyApi.setAccessToken(user.connectServices.spotify.access_token);
    } else {
        throw new Error("Failed to set Spotify token for user.");
    }
}

async function newSavedTrack(userId) {
    await setSpotifyToken(userId);
    const savedTracks = await spotifyApi.getMySavedTracks({ limit: 1 });
    return savedTracks.body.items.length > 0 ? savedTracks.body.items[0] : null;
}

async function newSavedAlbum(userId) {
    await setSpotifyToken(userId);
    const savedAlbums = await spotifyApi.getMySavedAlbums({ limit: 1 });
    return savedAlbums.body.items.length > 0 ? savedAlbums.body.items[0] : null;
}

async function newRecentlyPlayedTrack(userId) {
    await setSpotifyToken(userId);
    const recentlyPlayedTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
    return recentlyPlayedTracks.body.items.length > 0
        ? recentlyPlayedTracks.body.items[0].track
        : null;
}

async function newTrackAddedToPlaylist(userId, playlistName) {
    await setSpotifyToken(userId);
    const playlists = await spotifyApi.getUserPlaylists();
    const targetPlaylist = playlists.body.items.find((playlist) => playlist.name === playlistName);
    if (!targetPlaylist) {
        throw new Error("Specified playlist not found");
    }
    const playlistId = targetPlaylist.id;
    const tracksInPlaylist = await spotifyApi.getPlaylistTracks(playlistId);
    return tracksInPlaylist.body.items.length > 0 ? tracksInPlaylist.body.items[0].track : null;
}

async function followPlaylist(userId, playlistId) {
    await setSpotifyToken(userId);
    return spotifyApi.followPlaylist(playlistId);
}

async function saveTrack(userId, trackName) {
    await setSpotifyToken(userId);
    const searchResult = await spotifyApi.searchTracks(trackName);
    const trackId = searchResult.body.tracks.items[0].id;
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
