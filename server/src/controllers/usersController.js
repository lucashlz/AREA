const User = require("../models/user");

exports.getAllUsers = async (res) => {
  try {
    const users = await User.find().select("-password -confirmationToken");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
