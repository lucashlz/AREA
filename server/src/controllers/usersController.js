const User = require("../models/userModels");

exports.deleteLoggedInUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const deleted = await User.deleteOne({ _id: userId });

        if (deleted.n === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.disconnectService = async (req, res) => {
    try {
        const serviceName = req.params.service_name;

        if (!serviceName) {
            return res.status(400).json({ message: "Service name not provided." });
        }
        const user = req.user;
        if (user.connectServices.has(serviceName)) {
            user.connectServices.delete(serviceName);
            await user.save();
            await Area.updateMany(
                {
                    userId: user._id,
                    $or: [{ "trigger.service": serviceName }, { "actions.service": serviceName }],
                },
                { isActive: false }
            );
            res.status(200).json({
                message: `Successfully disconnected from ${serviceName} and related areas have been deactivated.`,
            });
        } else {
            res.status(400).json({ message: `User is not connected to ${serviceName}.` });
        }
    } catch (error) {
        res.status(500).json({ message: "Error disconnecting the service.", error });
    }
};
