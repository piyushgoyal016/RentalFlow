/**
 * @file errorHandler.middleware.js
 * @description Global centralized error handling middleware.
 */

import { config } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { logger } from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not already an instance of our structured ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Handle specific Prisma database errors
  if (err.code === "P2002") {
    const field = err.meta?.target ? err.meta.target.join(", ") : "field";
    error = new ApiError(400, `Duplicate value for unique: ${field}`);
  } else if (err.code === "P2025") {
    error = new ApiError(404, "Record not found");
  } else if (err.code === "P2003") {
    error = new ApiError(400, "Foreign key constraint failed");
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(config.isDevelopment && { stack: error.stack }), // Only show stack trace in dev mode
  };

  // Log error using Winston
  if (error.statusCode >= 500) {
    logger.error(`[SERVER FAULT] ${req.method} ${req.originalUrl}:`, { error: error.message, stack: error.stack });
  } else {
    logger.warn(`[CLIENT ERROR] ${req.method} ${req.originalUrl}:`, { message: error.message });
  }

  res.status(error.statusCode).json(response);
};

export default errorHandler;
