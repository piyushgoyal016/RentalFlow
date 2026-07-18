import * as userService from "../services/user.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getUserProfile(req.user.id);
    return res.status(200).json(new ApiResponse(200, profile, "Profile fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await userService.updateUserProfile(req.user.id, req.body);
    return res.status(200).json(new ApiResponse(200, profile, "Profile updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user.id, oldPassword, newPassword);
    return res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
  } catch (error) {
    next(error);
  }
};
