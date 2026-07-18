/**
 * @file ApiResponse.js
 * @description Standard success response utility.
 */

class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (200, 201, etc.)
   * @param {any} data - The payload to send back to the client
   * @param {string} message - Optional human-readable message
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Success is true for status codes 100-399
  }
}

export default ApiResponse;
