import * as depositService from "../services/deposit.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const collectDeposit = async (req, res, next) => {
  try {
    const { rentalOrderId, amount } = req.body;
    const deposit = await depositService.collectDeposit(rentalOrderId, amount);
    return res.status(201).json(new ApiResponse(201, deposit, "Security deposit collected successfully"));
  } catch (error) {
    next(error);
  }
};

export const getDeposit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deposit = await depositService.getDeposit(id);
    return res.status(200).json(new ApiResponse(200, deposit, "Security deposit fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getDepositHistory = async (req, res, next) => {
  try {
    const deposits = await depositService.getAllDeposits();
    return res.status(200).json(new ApiResponse(200, deposits, "Deposit history fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const refundDeposit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { refundAmount } = req.body;
    const deposit = await depositService.refundDeposit(id, refundAmount);
    return res.status(200).json(new ApiResponse(200, deposit, "Security deposit refunded successfully"));
  } catch (error) {
    next(error);
  }
};
