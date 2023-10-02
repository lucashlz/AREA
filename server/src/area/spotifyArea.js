const SpotifyWebApi = require("spotify-web-api-node");
const User = require("../models/userModels");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:8080/connect/spotify/callback",
});

async function getTopTracks(userId) {
    const user = await User.findById(userId);
    spotifyApi.setAccessToken(user.spotifyToken);

    const response = await spotifyApi.getMyTopTracks();
    return response.body.items;
}

async function getPlaylistCount(userId) {
    const user = await User.findById(userId);
    spotifyApi.setAccessToken(user.spotifyToken);

    const response = await spotifyApi.getUserPlaylists(user.spotifyUsername);
    return response.body.items.length;
}

exports.newTopTrackTrigger = async (userId, lastTopTrackId) => {
    const topTracks = await getTopTracks(userId);
    return topTracks[0].id !== lastTopTrackId;
};

exports.newPlaylistTrigger = async (userId, lastCount) => {
    const currentCount = await getPlaylistCount(userId);
    return currentCount > lastCount;
};

exports.addToPlaylist = async (userId, trackId, playlistId) => {
    const user = await User.findById(userId);
    spotifyApi.setAccessToken(user.spotifyToken);

    return spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${trackId}`]);
};

exports.createPlaylist = async (userId, playlistName) => {
    const user = await User.findById(userId);
    spotifyApi.setAccessToken(user.spotifyToken);

    return spotifyApi.createPlaylist(user.spotifyUsername, playlistName, { public: false });
};
