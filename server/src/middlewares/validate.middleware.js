import ApiError from "../utils/ApiError.js";

/**
 * Middleware constructor to validate req.body against a validation schema
 * @param {object} schema - The validation schema object
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    Object.keys(schema).forEach((field) => {
      const rules = schema[field];
      const value = req.body[field];

      // Check required
      if (rules.required && (value === undefined || value === null || value === "")) {
        errors.push({ field, message: rules.message || `${field} is required` });
        return;
      }

      // Skip remaining checks if value is optional and not provided
      if (!rules.required && (value === undefined || value === null || value === "")) {
        return;
      }

      // Check min length
      if (rules.minLength && String(value).length < rules.minLength) {
        errors.push({ field, message: rules.message || `${field} must be at least ${rules.minLength} characters` });
      }

      // Check regex pattern
      if (rules.pattern && !rules.pattern.test(String(value))) {
        errors.push({ field, message: rules.message || `Invalid format for ${field}` });
      }
    });

    if (errors.length > 0) {
      // 400 Bad Request with a list of validation errors
      return next(new ApiError(400, "Validation Failed", errors));
    }

    next();
  };
};
