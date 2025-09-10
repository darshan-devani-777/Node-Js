const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CODES = require("../response/responseCode");
const Response = require("../helpers/response");

// Register
exports.register = async (name, email, password) => {
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return Response("ERROR", CODES.ERROR.EMAIL_EXISTS, "Email already registered.", null);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return Response("SUCCESS", CODES.SUCCESS.USER_CREATED, "User registered successfully...", {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    return Response("ERROR", CODES.ERROR.CREATE_FAILED, err.message, null);
  }
};

// Login
exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return Response("ERROR", CODES.ERROR.USER_NOT_FOUND, "Invalid credentials", null);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response("ERROR", CODES.ERROR.LOGIN_FAILED, "Invalid credentials", null);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return Response("SUCCESS", "LOGIN_SUCCESS", "User login successfully...", {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return Response("ERROR", CODES.ERROR.LOGIN_FAILED, err.message, null);
  }
};
