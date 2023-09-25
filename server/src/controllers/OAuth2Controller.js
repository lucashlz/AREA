const User = require("../models/user");
const bcrypt = require("bcryptjs");

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const updateUserOAuthService = async (
  user,
  service,
  token,
  refreshToken,
  profileData
) => {
  user.connectServices.set(service, {
    access_token: token,
    refresh_token: refreshToken,
    data: profileData,
  });
  return await user.save();
};

const createUserFromOAuthProfile = async (
  service,
  token,
  refreshToken,
  profileData
) => {
  const randomPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(randomPassword);

  const userFields = {
    username: profileData.name,
    email: profileData.email,
    password: hashedPassword,
    confirmed: true,
    [`is${service.charAt(0).toUpperCase() + service.slice(1)}Auth`]: true,
    connectServices: {
      [service]: {
        accessToken: token,
        refreshToken: refreshToken,
        data: profileData,
      },
    },
  };

  const newUser = new User(userFields);
  return await newUser.save();
};

const oAuthHandler = (service, getNameFromProfile) => {
  return async (token, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await findUserByEmail(email);
      const profileData = {
        id: profile.id,
        email: email,
        name: getNameFromProfile(profile),
      };

      if (user) {
        await updateUserOAuthService(
          user,
          service,
          token,
          refreshToken,
          profileData
        );
      } else {
        user = await createUserFromOAuthProfile(
          service,
          token,
          refreshToken,
          profileData
        );
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  };
};

exports.googleOAuth2 = oAuthHandler("google", (profile) => profile.displayName);

exports.facebookOAuth2 = oAuthHandler(
  "facebook",
  (profile) => `${profile.name.givenName} ${profile.name.familyName}`
);
