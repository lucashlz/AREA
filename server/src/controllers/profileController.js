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
            updatedFields.push("Username");
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
                updatedFields.push("Email");
            }
        }

        if (oldPassword && newPassword) {
            if (oldPassword === newPassword) {
                return res.status(400).json({ message: "Same old and new password provided." });
            }
            if (hasGoogleAuth) {
                return res.status(403).json({
                    message:
                        "You've previously logged in using an external service. You cannot change your password.",
                });
            }
            await updateUserPassword(user, oldPassword, newPassword);
            updatedFields.push("Password");
        }
        await user.save();
        const messageComponents = [];
        const updateSuccessFields = updatedFields.filter(field => ['Username', 'Password'].includes(field));
        if (updateSuccessFields.length) {
            messageComponents.push(`${updateSuccessFields.join(", ")} updated successfully.`);
        }

        if (updatedFields.includes("Email")) {
            messageComponents.push("Please check your email to confirm the new email adress.");
        } else if (!updatedFields.length) {
            messageComponents.push("No fields were changed.");
        }
        const message = messageComponents.join(" ");
        res.json({ message });
    } catch (err) {
        console.error(err);
        if (
            [
                "Invalid email format",
                "Email is already in use",
                "Old password is incorrect",
                "Same old and new password provided."
            ].includes(err.message)
        ) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message || "Server error" });
    }
};
