import * as userRepository from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.util.js";
import ApiError from "../utils/ApiError.js";

/**
 * Handle user registration flow
 * @param {object} payload - User details (firstName, lastName, email, password, phone, roleName)
 * @returns {Promise<object>} Created user and initial JWT tokens
 */
export const registerUser = async (payload) => {
  const { firstName, lastName, email, password, phone, roleName = "CUSTOMER" } = payload;

  // 1. Check if email already exists
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(400, "Email is already registered");
  }

  // 2. Resolve Role
  const role = await userRepository.findRoleByName(roleName.toUpperCase());
  if (!role) {
    throw new ApiError(404, `Role '${roleName}' does not exist in the database`);
  }

  // 3. Hash Password
  const hashedPassword = await hashPassword(password);

  // 4. Create User
  const user = await userRepository.createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    roleId: role.id,
  });

  // 5. Generate Tokens
  const userPayload = { id: user.id, email: user.email, role: user.role.name };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  // Remove password before returning
  const { password: _, ...sanitizedUser } = user;

  return {
    user: sanitizedUser,
    accessToken,
    refreshToken,
  };
};

/**
 * Handle user login flow
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Logged in user and JWT tokens
 */
export const loginUser = async (email, password) => {
  // 1. Fetch user by email
  const user = await userRepository.findUserByEmail(email);
  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Validate Password
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Generate Tokens
  const userPayload = { id: user.id, email: user.email, role: user.role.name };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  // Remove password before returning
  const { password: _, ...sanitizedUser } = user;

  return {
    user: sanitizedUser,
    accessToken,
    refreshToken,
  };
};
