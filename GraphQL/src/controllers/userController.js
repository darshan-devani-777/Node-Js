const User = require("../models/User");
const CODES = require("../response/responseCode");
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

// Get ALl User (Cursor-based Pagination)
exports.getUsersPaginated = async ({ first = 10, after, last, before }) => {
  try {
    const limit = Math.min(first || last || 10, 100);
    const query = {};

    if (after) {
      query._id = { $gt: after };
    } else if (before) {
      query._id = { $lt: before };
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ _id: 1 })
      .limit(limit + 1);

    const hasNextPage = users.length > limit;
    if (hasNextPage) users.pop();

    const edges = users.map((u) => ({
      node: { id: u._id.toString(), name: u.name, email: u.email },
      cursor: u._id.toString()
    }));

    const totalCount = await User.countDocuments();

    const connection = {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: Boolean(after),
        startCursor: edges[0]?.cursor || null,
        endCursor: edges[edges.length - 1]?.cursor || null,
      },
      totalCount,
    };

    return buildResponse(
     "SUCCESS", CODES.SUCCESS.USERS_FETCHED,
      "Users fetched successfully...",
      connection
    );

  } catch (err) {
    return buildResponse(
      "error",
      "500",
      err.message || "Failed to fetch users",
      null
    );
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
