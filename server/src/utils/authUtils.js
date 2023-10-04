const User = require("../models/userModels");

const findUserByExternalId = async (service, serviceId) => {
    return User.findOne({
        "externalAuth.service": service,
        "externalAuth.serviceId": serviceId,
    });
};

const updateUserConnectionService = async (user, data) => {
    user.connectServices.set(serviceName, {
        access_token: data.access_token,
        data: data.data,
    });
    await user.save();
};

const createNewExternalUser = async (service, email, serviceId, profileData) => {
    const usernameFromEmail = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");

    const newUser = new User({
        username: usernameFromEmail,
        email: email,
        externalAuth: [
            {
                service: service,
                serviceId: serviceId,
            },
        ],
        connectServices: {
            [service]: {
                access_token: profileData.access_token,
                data: profileData.data,
            },
        },
    });

    await newUser.save();
    return newUser;
};

module.exports = {
    findUserByExternalId,
    updateUserConnectionService,
    createNewExternalUser,
};
