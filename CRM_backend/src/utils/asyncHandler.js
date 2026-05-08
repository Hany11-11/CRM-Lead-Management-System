/**
 * Higher-order function that wraps async route handlers
 * Automatically catches errors and forwards them to Express error middleware
 * Eliminates need for try-catch blocks in each route handler
 * @param {Function} fn - Async route handler function (req, res, next)
 * @returns {Function} Wrapped handler that catches errors
 * @example
 * const getUser = asyncHandler(async (req, res) => {
 *   const user = await User.findById(req.params.id);
 *   res.json(user);
 * });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
