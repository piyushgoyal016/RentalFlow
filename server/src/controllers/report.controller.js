import * as reportService from "../services/report.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getRevenueReport = async (req, res, next) => {
  try {
    const report = await reportService.generateRevenueReport();
    return res.status(200).json(new ApiResponse(200, report, "Revenue report generated"));
  } catch (error) {
    next(error);
  }
};

export const getRentalReport = async (req, res, next) => {
  try {
    const report = await reportService.generateRentalReport();
    return res.status(200).json(new ApiResponse(200, report, "Rental report generated"));
  } catch (error) {
    next(error);
  }
};

export const getCustomerReport = async (req, res, next) => {
  try {
    const report = await reportService.generateCustomerReport();
    return res.status(200).json(new ApiResponse(200, report, "Customer report generated"));
  } catch (error) {
    next(error);
  }
};

export const getProductReport = async (req, res, next) => {
  try {
    const report = await reportService.generateProductReport();
    return res.status(200).json(new ApiResponse(200, report, "Product report generated"));
  } catch (error) {
    next(error);
  }
};
