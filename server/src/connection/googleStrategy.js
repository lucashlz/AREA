const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  "google-connect",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        "externalAuth.serviceId": profile.id,
      });
      if (existingUser) {
        const isGoogleAuth = existingUser.externalAuth.some(
          (auth) => auth.service === "google"
        );
        if (isGoogleAuth) {
          return done(new Error("User already connected with Google"));
        }
      } else {
        const loggedInUser = req.user;
        if (loggedInUser) {
          const googleService = {
            access_token: accessToken,
            refresh_token: refreshToken,
            data: profile._json,
          };
          loggedInUser.connectServices.set("google", googleService);
          loggedInUser.externalAuth.push({
            service: "google",
            serviceId: profile.id,
          });
          await loggedInUser.save();
          return done(null, loggedInUser, { accessToken, refreshToken });
        }
      }
      return done(
        new Error("No associated user found for this Google account.")
      );
    }
  )
);
