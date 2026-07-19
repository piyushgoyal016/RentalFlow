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

export const getAllUsers = async (roleName) => {
  const users = await userRepository.findAllUsers(roleName);
  return users.map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
};

export const createUser = async (data) => {
  const existingUser = await userRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const roleName = data.role || "CUSTOMER";
  const role = await userRepository.findRoleByName(roleName);
  if (!role) {
    throw new ApiError(400, `Role '${roleName}' not found`);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const newUser = await userRepository.createUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    roleId: role.id,
  });

  const { password: _, ...safeUser } = newUser;
  return safeUser;
};

