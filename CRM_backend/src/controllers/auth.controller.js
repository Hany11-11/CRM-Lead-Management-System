const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * Generates a signed JWT token for user authentication
 * @param {string} userId - MongoDB user ID
 * @returns {string} Signed JWT token
 * @private
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Login user with email and password
 * Validates credentials against database and issues JWT token
 * Sets HTTP-only cookie for additional security
 * @route POST /api/auth/login
 * @access Public
 * @param {Object} req - Express request
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @returns {Object} Success response with token and user data
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }

  // Check database for user credentials
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return sendError(res, 401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  // Set HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return sendSuccess(res, 200, "Login successful", {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * Logout user and clear authentication cookie
 * @route POST /api/auth/logout
 * @access Private (Requires authentication)
 * @returns {Object} Success message
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return sendSuccess(res, 200, "Logged out successfully");
});

/**
 * Get currently authenticated user profile
 * @route GET /api/auth/me
 * @access Private (Requires authentication)
 * @returns {Object} User profile data (id, name, email, role)
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return sendError(res, 404, "User not found");
  }
  return sendSuccess(res, 200, "User retrieved", {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

module.exports = { login, logout, getMe };
