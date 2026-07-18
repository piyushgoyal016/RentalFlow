import * as returnService from "../services/return.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const processReturn = async (req, res, next) => {
  try {
    const { rentalOrderId, ...data } = req.body;
    const returnInspection = await returnService.processReturn(rentalOrderId, data);
    return res.status(201).json(new ApiResponse(201, returnInspection, "Return processed successfully"));
  } catch (error) {
    next(error);
  }
};

export const getReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inspection = await returnService.getReturnInspection(id);
    return res.status(200).json(new ApiResponse(200, inspection, "Return inspection fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllReturns = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const returns = await returnService.getAllReturns(page, limit);
    return res.status(200).json(new ApiResponse(200, returns, "Returns history fetched successfully"));
  } catch (error) {
    next(error);
  }
};
