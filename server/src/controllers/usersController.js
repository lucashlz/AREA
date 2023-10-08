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
