import * as userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";

export const getUserProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw new ApiError(404, "User not found");
  
  // Exclude password
  const { password, ...safeUser } = user;
  return safeUser;
};

export const updateUserProfile = async (userId, data) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const allowedUpdates = {};
  if (data.firstName !== undefined) allowedUpdates.firstName = data.firstName;
  if (data.lastName !== undefined) allowedUpdates.lastName = data.lastName;
  if (data.phone !== undefined) allowedUpdates.phone = data.phone;
  if (data.companyName !== undefined) allowedUpdates.companyName = data.companyName;
  if (data.companyLogo !== undefined) allowedUpdates.companyLogo = data.companyLogo;
  if (data.gstNo !== undefined) allowedUpdates.gstNo = data.gstNo;

  const updatedUser = await userRepository.updateUser(userId, allowedUpdates);
  const { password: _, ...safeUser } = updatedUser;
  return safeUser;
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new ApiError(400, "Invalid old password");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await userRepository.updateUser(userId, { password: hashedPassword });
  return { success: true, message: "Password updated successfully" };
};
