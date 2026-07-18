/**
 * @file ApiError.js
 * @description Custom operational error class extending built-in Error.
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 403, 404, 500)
   * @param {string} message - Error description
   * @param {Array} errors - Detailed validation/operational errors array
   * @param {string} stack - Optional custom stack trace
   */
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    // Operational errors are predicted failures (e.g., bad request, user already exists)
    // Non-operational errors are programming bugs or system failures
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
