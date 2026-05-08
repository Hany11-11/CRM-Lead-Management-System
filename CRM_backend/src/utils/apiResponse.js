/**
 * Sends a consistent success JSON response with standard format
 * @param {Object} res - Express response object
 * @param {number} [statusCode=200] - HTTP status code
 * @param {string} [message='Success'] - Success message
 * @param {*} [data=null] - Response data payload (optional)
 * @returns {Object} Express response object
 * @example
 * sendSuccess(res, 200, 'User created', { id: '123', name: 'John' });
 * // Returns: { success: true, message: 'User created', data: { id: '123', name: 'John' } }
 */
const sendSuccess = (
  res,
  statusCode = 200,
  message = "Success",
  data = null,
) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Sends a consistent error JSON response with standard format
 * @param {Object} res - Express response object
 * @param {number} [statusCode=500] - HTTP status code
 * @param {string} [message='Server Error'] - Error message
 * @returns {Object} Express response object
 * @example
 * sendError(res, 404, 'User not found');
 * // Returns: { success: false, message: 'User not found' }
 */
const sendError = (res, statusCode = 500, message = "Server Error") => {
  return res.status(statusCode).json({ success: false, message });
};

module.exports = { sendSuccess, sendError };
