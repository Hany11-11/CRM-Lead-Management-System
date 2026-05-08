const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendError } = require("../utils/apiResponse");

/**
 * Authentication middleware - Protects routes requiring JWT
 * Extracts and verifies JWT from Authorization header or cookies
 * Populates req.user with authenticated user data
 * @async
 * @middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {401} If token is missing, invalid, or user not found
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header first, then cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 401, "Not authorized. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 401, "User no longer exists.");
    }
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    return sendError(
      res,
      401,
      "Invalid or expired token. Please log in again.",
    );
  }
});

module.exports = { protect };
