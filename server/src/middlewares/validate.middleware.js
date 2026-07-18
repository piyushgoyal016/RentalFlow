import ApiError from "../utils/ApiError.js";

/**
 * Middleware to validate req.body against a Zod schema
 * @param {import("zod").ZodSchema} schema - The Zod validation schema
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Parse and validate the request body
      // This will also strip unknown fields if schema is defined correctly
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error.name === "ZodError") {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join("."),
          message: err.message
        }));
        return next(new ApiError(400, "Validation Failed", formattedErrors));
      }
      next(error);
    }
  };
};
