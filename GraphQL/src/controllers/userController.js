const User = require("../models/User");
const CODES = require("../constants/responseCode");
const buildResponse = require("../helpers/response");

// Get All User
exports.getUsers = async () => {
  try {
    const users = await User.find().select("-password");
    return buildResponse("SUCCESS", CODES.SUCCESS.USERS_FETCHED, "Users fetched successfully...", users);
  } catch (err) {
    return buildResponse("ERROR", CODES.ERROR.FETCH_FAILED, err.message, null);
  }
};

// Get User By Id
exports.getUserById = async (id) => {
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return buildResponse("ERROR", CODES.ERROR.USER_NOT_FOUND, "User not found", null);
    }
    return buildResponse("SUCCESS", CODES.SUCCESS.USER_FETCHED, "User fetched successfully...", user);
  } catch (err) {
    return buildResponse("ERROR", CODES.ERROR.FETCH_FAILED, err.message, null);
  }
};

// Update User
exports.updateUser = async (id, data) => {
  try {
    if (data.password) delete data.password; 
    const user = await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
    if (!user) {
      return buildResponse("ERROR", CODES.ERROR.USER_NOT_FOUND, "User not found", null);
    }
    return buildResponse("SUCCESS", CODES.SUCCESS.USER_UPDATED, "User updated successfully...", user);
  } catch (err) {
    return buildResponse("ERROR", CODES.ERROR.UPDATE_FAILED, err.message, null);
  }
};

// Delete User
exports.deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id).select("-password");
    if (!user) {
      return buildResponse("ERROR", CODES.ERROR.USER_NOT_FOUND, "User not found", null);
    }
    return buildResponse("SUCCESS", CODES.SUCCESS.USER_DELETED, "User deleted successfully...", user);
  } catch (err) {
    return buildResponse("ERROR", CODES.ERROR.DELETE_FAILED, err.message, null);
  }
};
