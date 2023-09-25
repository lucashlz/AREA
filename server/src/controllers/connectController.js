exports.connectGoogleOAuth2 = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const { token, refreshToken, profile } = req;

    if (user.connectServices && user.connectServices.google) {
      return res.status(400).json({ message: "Already connected with Google" });
    }
    user.connectServices.set("google", {
      access_token: token,
      refresh_token: refreshToken,
      data: {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      },
    });
    await user.save();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};
