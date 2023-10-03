const User = require("../models/userModels");

const findUserByExternalId = async (service, serviceId) => {
  return User.findOne({
    "externalAuth.service": service,
    "externalAuth.serviceId": serviceId,
  });
};

const updateUserConnectionService = async (user, service, data) => {
  user.connectServices.set(service, data);
  await user.save();
};

const createNewExternalUser = async (
  service,
  email,
  serviceId,
  profileData
) => {
  const usernameFromEmail = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
  const newUser = new User({
    username: usernameFromEmail,
    email: email,
    externalAuth: {
      service: service,
      serviceId: serviceId,
    },
  });
  newUser.connectServices.set(service, profileData);
  await newUser.save();
  return newUser;
};

module.exports = {
  findUserByExternalId,
  updateUserConnectionService,
  createNewExternalUser,
};
