const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider } = require('twitch-auth');
const User = require('../models/userModels');

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const twitchApi = new ApiClient({ authProvider });

async function setTwitchToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.twitch) {
    } else {
        throw new Error('Failed to set Twitch token for user.');
    }
}

async function streamGoingLiveForChannel(userId, channelName) {
    await setTwitchToken(userId);
    const stream = await twitchApi.streams.getStreamByUserName(channelName);
    return stream ? stream : null;
}

async function youFollowNewChannel(userId) {
    await setTwitchToken(userId);
    const followedChannels = await twitchApi.users.getFollowedChannels(userId);
    const user = await User.findById(userId);
    const lastStoredChannels = user.lastFollowedChannels || [];
    const newFollowedChannels = followedChannels.filter(channel => !lastStoredChannels.includes(channel.id));
    user.lastFollowedChannels = followedChannels.map(channel => channel.id);
    await user.save();
    return newFollowedChannels;
}

async function userFollowedChannel(userId, username) {
    await setTwitchToken(userId);
    const user = await twitchApi.users.getUserByName(username);
    const followedChannels = await twitchApi.users.getFollowedChannels(user.id);
    const storedUser = await User.findOne({ twitchUsername: username });
    const lastStoredChannels = storedUser.lastFollowedChannels || [];
    const newFollowedChannels = followedChannels.filter(channel => !lastStoredChannels.includes(channel.id));
    storedUser.lastFollowedChannels = followedChannels.map(channel => channel.id);
    await storedUser.save();
    return newFollowedChannels;
}

async function newFollowerOnYourChannel(userId) {
    await setTwitchToken(userId);
    const followers = await twitchApi.users.getFollowers(userId);

    const user = await User.findById(userId);
    const lastStoredFollowers = user.lastFollowers || [];
    const newFollowers = followers.filter(follower => !lastStoredFollowers.includes(follower.id));
    user.lastFollowers = followers.map(follower => follower.id);
    await user.save();

    return newFollowers;
}

module.exports = {
    streamGoingLiveForChannel,
    youFollowNewChannel,
    userFollowedChannel,
    newFollowerOnYourChannel
};
