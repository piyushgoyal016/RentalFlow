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

    const userRole = req.user.role.toUpperCase();
    const rolesToCheck = [userRole];
    if (userRole === "VENDOR") {
      rolesToCheck.push("MANAGER");
    }

    const hasRole = allowedRoles.some(
      (role) => rolesToCheck.includes(role.toUpperCase())
    );

    if (!hasRole) {
      return next(new ApiError(403, "Access denied: insufficient permissions"));
    }

    next();
  };
};
