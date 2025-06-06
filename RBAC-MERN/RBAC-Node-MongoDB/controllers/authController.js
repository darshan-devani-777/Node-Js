const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    let assignedRole = "user";

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const caller = await User.findById(decoded.id);

        if (!caller) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid token user" });
        }

        if (role && role !== "user") {
          if (caller.role !== "superadmin") {
            return res.status(403).json({
              success: false,
              message: "Only superadmin can assign roles other than 'user'",
            });
          }
          assignedRole = role;
        }
      } catch (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
      }
    }

    const user = new User({ name, email, password, role: assignedRole });
    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully...",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "User Login Successfully...",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
