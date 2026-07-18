import * as paymentService from "../services/payment.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createPayment = async (req, res, next) => {
  try {
    const { rentalOrderId, amount } = req.body;
    const payment = await paymentService.createPayment(rentalOrderId, amount);
    return res.status(201).json(new ApiResponse(201, payment, "Payment initialized successfully"));
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.getPayment(id);
    return res.status(200).json(new ApiResponse(200, payment, "Payment fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const payment = await paymentService.updatePaymentStatus(id, status);
    return res.status(200).json(new ApiResponse(200, payment, "Payment status updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.refundPayment(id);
    return res.status(200).json(new ApiResponse(200, payment, "Payment refunded successfully"));
  } catch (error) {
    next(error);
  }
};
