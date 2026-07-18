import ApiError from "../utils/ApiError.js";
import { ROLES } from "../utils/roles.enum.js";

/**
 * Express middleware to restrict route access to specific roles.
 * @param {...string} allowedRoles - List of role names allowed to access this route (e.g. "ADMIN", "MANAGER")
 * @returns {Function} Express middleware function
 */
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    const hasRole = allowedRoles.some(
      (role) => req.user.role.toUpperCase() === role.toUpperCase()
    );

    if (!hasRole) {
      return next(new ApiError(403, "Access denied: insufficient permissions"));
    }

    next();
  };
};
