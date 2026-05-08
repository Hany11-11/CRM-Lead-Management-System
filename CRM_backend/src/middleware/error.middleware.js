const { sendError } = require("../utils/apiResponse");

/**
 * Global error handler middleware for Express
 * Must be registered AFTER all routes in app.js
 * Handles:
 *   - Mongoose CastError (invalid ObjectId)
 *   - Mongoose duplicate key errors
 *   - Mongoose validation errors
 *   - JWT token errors
 *   - Generic errors
 * Logs full error stack in development mode for debugging
 * @middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware function
 * @returns {Object} Formatted error response
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${err.stack}`);
  }

  return sendError(res, statusCode, message);
};

module.exports = errorHandler;
