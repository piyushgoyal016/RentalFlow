import { verifyAccessToken } from "../utils/jwt.util.js";
import * as userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";

/**
 * Express middleware to authenticate users using JWT Access Token.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication token is missing or invalid");
    }

    const token = authHeader.split(" ")[1];
    
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (jwtError) {
      throw new ApiError(401, "Authentication token has expired or is invalid");
    }

    // Verify user still exists and is active in database
    const user = await userRepository.findUserById(decoded.id);
    if (!user) {
      throw new ApiError(401, "The user belonging to this token no longer exists");
    }

    if (!user.isActive) {
      throw new ApiError(401, "User account is suspended");
    }

    // Store user info on request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};
