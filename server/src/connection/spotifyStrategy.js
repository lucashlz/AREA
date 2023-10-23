const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;

passport.use(
    "spotify-connect",
    new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/connect/spotify/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, expires_in, profile, done) => {
            try {
                const user = req.user;
                if (!user) {
                    return done(new Error("No associated user found for this session."));
                }
                const spotifyService = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: expires_in * 1000,
                    tokenIssuedAt: Date.now(),
                    data: profile._json,
                };
                console.log("SpotifyService: ", spotifyService);
                user.connectServices.set("spotify", spotifyService);
                await user.save();
                return done(null, user);
            } catch (error) {
                console.error("Error during Spotify connection:", error);
                return done(error);
            }
        }
    )
);
