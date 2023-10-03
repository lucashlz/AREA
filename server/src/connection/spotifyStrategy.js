const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("../models/userModels");

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
        const existingUser = await User.findOne({
          "externalAuth.serviceId": profile.id,
        });

        if (existingUser) {
          const isSpotifyAuth = existingUser.externalAuth.some(
            (auth) => auth.service === "spotify"
          );
          if (isSpotifyAuth) {
            return done(new Error("User already connected with Spotify"));
          }
        } else {
          const loggedInUser = await User.findById(req.user.id);
          if (loggedInUser) {
            const spotifyService = {
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_in: expires_in,
              data: profile._json,
            };
            loggedInUser.connectServices.set("spotify", spotifyService);
            await loggedInUser.save();
            return done(null, loggedInUser, {
              accessToken,
              refreshToken,
              data: profile._json,
            });
          }
        }
        return done(
          new Error("No associated user found for this Spotify account.")
        );
      } catch (error) {
        console.error("Error during Spotify connection:", error);
        return done(error);
      }
    }
  )
);
