import * as authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Controller to handle user registration
 */
export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    
    return res
      .status(201)
      .json(new ApiResponse(201, result, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle user login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Login successful"));
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle user logout
 */
export const logout = async (req, res, next) => {
  try {
    // In standard JWT stateless authentication, the server doesn't maintain sessions.
    // Logout is done by the client discarding the token.
    // However, we return a successful response verifying logout.
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logout successful. Please delete your tokens."));
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch the authenticated user's profile
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user was populated by requireAuth middleware
    return res
      .status(200)
      .json(new ApiResponse(200, { user: req.user }, "User profile retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
