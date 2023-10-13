const User = require("../models/userModels");

const findUserByExternalId = async (service, serviceEmail) => {
    return User.findOne({
        "externalAuth.service": service,
        "email": serviceEmail,
    });
};

const updateUserConnectionService = async (user, serviceName, data) => {
    user.connectServices.set(serviceName, {
        access_token: data.access_token,
        data: data.data,
    });
    await user.save();
};

const createNewExternalUser = async (service, email, serviceId) => {
    const usernameFromEmail = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");

    const newUser = new User({
        username: usernameFromEmail,
        email: email,
        confirmed: true,
        externalAuth: [
            {
                service: service,
                serviceId: serviceId,
            },
        ],
    });
    await newUser.save();
    return newUser;
};

module.exports = {
    findUserByExternalId,
    updateUserConnectionService,
    createNewExternalUser,
};
