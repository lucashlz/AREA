passport.use(
  "facebook-connect",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:8080/connect/facebook/callback",
      profileFields: ["id", "emails", "name"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        "externalAuth.serviceId": profile.id,
      });

      if (existingUser) {
        const isFacebookAuth = existingUser.externalAuth.some(
          (auth) => auth.service === "facebook"
        );

        if (isFacebookAuth) {
          return done(new Error("User already connected with Facebook"));
        }
      } else {
        const loggedInUser = req.user;

        if (loggedInUser) {
          const facebookService = {
            access_token: accessToken,
            refresh_token: refreshToken || "",
            data: profile._json,
          };

          loggedInUser.connectServices.set("facebook", facebookService);
          loggedInUser.externalAuth.push({
            service: "facebook",
            serviceId: profile.id,
          });

          await loggedInUser.save();

          return done(null, loggedInUser, { accessToken, refreshToken });
        }
      }

      return done(
        new Error("No associated user found for this Facebook account.")
      );
    }
  )
);
