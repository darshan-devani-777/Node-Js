const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");

const JWT_SECRET = process.env.JWT_SECRET;

// TOKEN VERIFY
exports.protect = async (req, res, next) => {
  let token;

  // STEP 1: Log incoming Authorization header
  console.log("Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // STEP 2: Log the token
  console.log("Extracted Token:", token);

  if (!token) {
    console.log("No token found in request.");
    return res.json({
      statusCode: StatusCodes.UNAUTHORIZED,
      success: flase,
      message: "Not authorized, no token",
    });
  }

  try {
    // STEP 3: Decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    // STEP 4: Find user by decoded id
    req.user = await User.findById(decoded.id).select("-password");
    console.log("User Found:", req.user);

    if (!req.user) {
      console.log("No user found with decoded ID.");
      return res.json({
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: "Invalid userId or user does not exist",
      });
    }

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.json({
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "Token invalid",
    });
  }
};
