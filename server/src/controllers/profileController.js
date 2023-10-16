const User = require("../models/userModels");
const { hasAuthService, updateUserEmail, updateUserPassword } = require("../utils/profileUtils");

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-_id username email connectServices");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const serviceNames = Array.from(user.connectServices.keys());
        res.json({
            ...user._doc,
            connectServices: serviceNames,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { email, username, oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        const updatedFields = [];
        if (!user) return res.status(404).json({ message: "User not found" });
        const hasGoogleAuth = hasAuthService(user, "google");
        if (username && username !== user.username) {
            user.username = username;
            updatedFields.push("username");
        }
        if (email) {
            if (hasGoogleAuth) {
                return res.status(403).json({
                    message:
                        "You've previously logged in using an external service. You cannot change your email.",
                });
            }
            if (email !== user.email) {
                await updateUserEmail(user, email);
                updatedFields.push("email");
            }
        }
        if (oldPassword && newPassword) {
            if (hasGoogleAuth) {
                return res.status(403).json({
                    message:
                        "You've previously logged in using an external service. You cannot change your password.",
                });
            }
            await updateUserPassword(user, oldPassword, newPassword);
            updatedFields.push("password");
        }
        await user.save();
        const message = updatedFields.length
            ? `Profile updated successfully. Fields changed: ${updatedFields.join(", ")}.`
            : "Profile updated successfully. No fields were changed.";
        res.json({ message });
    } catch (err) {
        console.error(err);
        if (
            [
                "Invalid email format",
                "Email is already in use",
                "Old password is incorrect",
            ].includes(err.message)
        ) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message || "Server error" });
    }
};
