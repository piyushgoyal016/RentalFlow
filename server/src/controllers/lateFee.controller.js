import * as lateFeeService from "../services/lateFee.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const chargeLateFee = async (req, res, next) => {
  try {
    const { returnInspectionId } = req.body;
    const fee = await lateFeeService.calculateAndChargePenalty(returnInspectionId);
    return res.status(201).json(new ApiResponse(201, fee, "Late fee calculated and charged"));
  } catch (error) {
    next(error);
  }
};

export const payLateFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fee = await lateFeeService.payLateFee(id);
    return res.status(200).json(new ApiResponse(200, fee, "Late fee marked as paid"));
  } catch (error) {
    next(error);
  }
};

export const getLateFees = async (req, res, next) => {
  try {
    const fees = await lateFeeService.getAllLateFees();
    return res.status(200).json(new ApiResponse(200, fees, "Late fees fetched successfully"));
  } catch (error) {
    next(error);
  }
};
