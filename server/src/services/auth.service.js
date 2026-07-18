import * as userRepository from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.util.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.util.js";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/db.js";

/**
 * Handle user registration flow
 */
export const registerUser = async (payload) => {
  const { firstName, lastName, email, password, phone, companyName, gstNo, roleName = "CUSTOMER" } = payload;

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(400, "Email is already registered");
  }

  const role = await userRepository.findRoleByName(roleName.toUpperCase());
  if (!role) {
    throw new ApiError(404, `Role '${roleName}' does not exist in the database`);
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepository.createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    companyName,
    gstNo,
    roleId: role.id,
  });

  const userPayload = { id: user.id, email: user.email, role: user.role.name };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  const { password: _, ...sanitizedUser } = user;

  return {
    user: sanitizedUser,
    accessToken,
    refreshToken,
  };
};

/**
 * Handle user login flow
 */
export const loginUser = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const userPayload = { id: user.id, email: user.email, role: user.role.name };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  const { password: _, ...sanitizedUser } = user;

  return {
    user: sanitizedUser,
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (token) => {
  if (!token) throw new ApiError(401, "Refresh token is missing");

  const blacklisted = await prisma.tokenBlacklist.findUnique({
    where: { token }
  });
  if (blacklisted) throw new ApiError(401, "Refresh token is revoked");

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await userRepository.findUserById(decoded.id);
  if (!user || !user.isActive) {
    throw new ApiError(401, "User no longer exists or is suspended");
  }

  const userPayload = { id: user.id, email: user.email, role: user.role.name };
  const accessToken = generateAccessToken(userPayload);
  
  return { accessToken };
};

/**
 * Logout user by blacklisting the refresh token
 */
export const logoutUser = async (token) => {
  if (!token) return; // If no token is provided, just return

  const blacklisted = await prisma.tokenBlacklist.findUnique({
    where: { token }
  });

  if (!blacklisted) {
    try {
      const decoded = verifyRefreshToken(token);
      await prisma.tokenBlacklist.create({
        data: {
          token,
          expiresAt: new Date(decoded.exp * 1000)
        }
      });
    } catch (err) {
      // If token is invalid or already expired, we can just ignore it
    }
  }
};

/**
 * Get user profile details
 */
export const getUserProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

/**
 * Update user profile details
 */
export const updateUserProfile = async (userId, payload) => {
  const { firstName, lastName, phone } = payload;
  const updateData = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (phone !== undefined) updateData.phone = phone;

  const user = await userRepository.updateUser(userId, updateData);
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};


