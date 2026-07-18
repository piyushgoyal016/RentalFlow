import * as dashboardService from "../services/dashboard.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
  } catch (error) {
    next(error);
  }
};
