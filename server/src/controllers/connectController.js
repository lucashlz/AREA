const { registerOAuthSession, verifyOAuthSession } = require("../utils/OAuthSessionUtils");

exports.getYoutubeOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "youtube");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/youtube/callback",
        scopes: ["profile", "https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/youtube.force-ssl"],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.youtubeCallback = async (req, res) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "youtube");
        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid state or session expired" });
        }
        const { accessToken, refreshToken, expiresIn, profile } = req.youtubeData;
        const youtubeService = {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn * 1000,
            tokenIssuedAt: Date.now(),
            data: profile,
        };
        user.connectServices.set("youtube", youtubeService);
        await user.save();
        res.status(200).redirect("http://localhost:8081/create?service=youtube");
    } catch (error) {
        console.error("Error during YouTube connection:", error);
        return res.status(500).redirect("http://localhost:8081/create?connect=error");
    }
};

exports.getGmailOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "gmail");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/gmail/callback",
        scopes: ["profile", "email", "https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.gmailCallback = async (req, res) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "gmail");
        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid state or session expired" });
        }
        const { accessToken, refreshToken, expiresIn, profile } = req.gmailData;
        const gmailService = {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn * 1000,
            tokenIssuedAt: Date.now(),
            data: profile,
        };
        user.connectServices.set("gmail", gmailService);
        await user.save();
        res.status(200).redirect("http://localhost:8081/create?service=gmail");
    } catch (error) {
        console.error("Error during Gmail connection:", error);
        return res.status(500).redirect("http://localhost:8081/create?connect=error");
    }
};

exports.getGithubOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "github");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.GITHUB_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/github/callback",
        scopes: ["user", "repo", "user:email"],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.githubCallback = async (req, res, next) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "github");

        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid state or session expired" });
        }
        req.user = user;
        const { accessToken, profile } = req.githubData;
        const githubService = {
            access_token: accessToken,
            refresh_token: accessToken,
            tokenIssuedAt: Date.now(),
            data: profile,
        };
        user.connectServices.set("github", githubService);
        await user.save();
        res.status(200).redirect("http://localhost:8081/create?service=github");
    } catch (error) {
        console.error("Error during GitHub connection:", error);
        return res.status(500).redirect("http://localhost:8081/create?connect=error");
    }
};

exports.getSpotifyOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "spotify");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/spotify/callback",
        scopes: [
            "user-library-read",
            "user-read-recently-played",
            "playlist-read-private",
            "playlist-modify-private",
            "playlist-modify-public",
            "user-library-modify",
            "user-follow-modify",
        ],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.spotifyCallback = async (req, res, next) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "spotify");
        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid state or session expired" });
        }
        req.user = user;
        const { accessToken, refreshToken, expiresIn, profile } = req.spotifyData;
        const spotifyService = {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn * 1000,
            tokenIssuedAt: Date.now(),
            data: profile,
        };
        console.log("SpotifyService: ", spotifyService);

        user.connectServices.set("spotify", spotifyService);
        await user.save();

        res.status(200).redirect("http://localhost:8081/create?service=spotify");
    } catch (error) {
        console.error("Error during Spotify connection:", error);
        return res.status(500).redirect("http://localhost:8081/create?connect=error");
    }
};

exports.getTwitchOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "twitch");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.TWITCH_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/twitch/callback",
        scopes: ["user:read:follows", "moderator:read:followers", "channel:read:subscriptions"],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.twitchCallback = async (req, res) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "twitch");
        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid state or session expired" });
        }
        const { accessToken, refreshToken, expiresIn, profile } = req.twitchData;
        const twitchService = {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn * 1000,
            tokenIssuedAt: Date.now(),
            data: profile,
        };
        user.connectServices.set("twitch", twitchService);
        await user.save();
        res.status(200).redirect("http://localhost:8081/create?service=twitch");
    } catch (error) {
        console.error("Error during Twitch connection:", error);
        return res.status(500).redirect("http://localhost:8081/create?connect=error");
    }
};

exports.getDropboxOAuthConstants = async (req, res) => {
    const oAuthSessionId = await registerOAuthSession(req.user.id, "dropbox");
    if (!oAuthSessionId) {
        return res.status(500).send("Failed to initiate OAuth session.");
    }
    return res.json({
        clientId: process.env.DROPBOX_CLIENT_ID,
        redirectUri: "http://localhost:8080/connect/dropbox/callback",
        scopes: [],
        oAuthSessionId: oAuthSessionId,
    });
};

exports.dropboxCallback = async (req, res) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const { user } = await verifyOAuthSession(oAuthSessionIdFromState, "dropbox");
        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid state or session expired" });
        }
        const { accessToken, refreshToken, expiresIn, profile } = req.dropboxData;
        const dropboxService = {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn * 1000,
            tokenIssuedAt: Date.now(),
            data: profile,
        };
        user.connectServices.set("dropbox", dropboxService);
        await user.save();
        res.status(200).redirect("http://localhost:8081/create?service=dropbox");
    } catch (error) {
        console.error("Error during Dropbox connection:", error);
        return res.status(500).redirect("http://localhost:8081/create?connect=error");
    }
};
