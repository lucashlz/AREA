const { getOAuthResponse } = require("../utils/connect/getOAuthResponse");
const { handleOAuthCallback } = require("../utils/connect/handleOAuthCallback");
const { SERVICES } = require("../config/serviceConfig");

exports.getOAuthConstants = async (serviceName, req, res) => {
    try {
        const response = await getOAuthResponse(req.user.id, serviceName);
        res.json(response);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

exports.callback = async (serviceName, req, res) => {
    try {
        const { state: oAuthSessionIdFromState } = req.query;
        const serviceData = req[SERVICES[serviceName].dataKey];
        const response = await handleOAuthCallback(serviceName, oAuthSessionIdFromState, serviceData);
        res.json(response);
    } catch (error) {
        console.error(`Error during ${serviceName} connection:`, error);
        return res.status(500).json({ status: "error", message: "Unexpected error occurred." });
    }
};
