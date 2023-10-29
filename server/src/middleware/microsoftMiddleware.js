const axios = require("axios");

async function microsoftOAuthMiddleware(req, res, next) {
    const code = req.query.code;
    const redirectUri = "http://localhost:8080/connect/microsoft/callback";
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    try {
        const tokenResponse = await axios.post("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
            client_id: clientId,
            scope: "openid profile User.Read",
            code: code,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
            client_secret: clientSecret,
        });
        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        const profileResponse = await axios.get("https://graph.microsoft.com/v1.0/me", {
            headers: {
                Authorization: "Bearer " + access_token,
            },
        });
        const profile = profileResponse.data;
        req.microsoftData = {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
            profile: profile,
        };
        next();
    } catch (error) {
        console.error("Error during token exchange:", error);
        return res.status(500).json({ status: "error", message: "Internal server error." });
    }
}

module.exports = microsoftOAuthMiddleware;
