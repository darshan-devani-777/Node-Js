const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// GET ALL USER
exports.getAllUsers = async (req, res) => {
  try {
    let users;

    if (req.user.role === "superadmin") {
      users = await User.find({}, "-password");
    } else if (req.user.role === "admin") {
      users = await User.find({ role: "user" }, "-password");
    } else {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      message: "Users Fetched Successfully...",
      users: users || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL ROLE
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await User.distinct("role");
    res.status(200).json({
      success: true,
      message: "Roles Fetched Successfully...",
      roles: roles || [],
    });
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User Fetched Successfully...",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE USER
exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };

    if (req.user.role !== "superadmin" && updateData.role) {
      delete updateData.role;
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);

      updateData.password = hashedPassword;
    } else {
      delete updateData.password;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    return res.json({ success: true, message:"User Updated Successfully..." , user: userResponse });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully...",
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
