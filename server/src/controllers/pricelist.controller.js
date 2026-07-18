import * as pricelistService from "../services/pricelist.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createPricelist = async (req, res, next) => {
  try {
    const pricelist = await pricelistService.createPricelist(req.body);
    return res.status(201).json(new ApiResponse(201, pricelist, "Pricelist created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getPricelists = async (req, res, next) => {
  try {
    const lists = await pricelistService.getPricelists();
    return res.status(200).json(new ApiResponse(200, lists, "Pricelists fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getPricelistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await pricelistService.getPricelistById(id);
    return res.status(200).json(new ApiResponse(200, list, "Pricelist fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updatePricelist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await pricelistService.updatePricelist(id, req.body);
    return res.status(200).json(new ApiResponse(200, list, "Pricelist updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deletePricelist = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pricelistService.deletePricelist(id);
    return res.status(200).json(new ApiResponse(200, null, "Pricelist deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const testResolvePrice = async (req, res, next) => {
  try {
    const { productId, quantity, durationHours } = req.body;
    const finalPrice = await pricelistService.resolveRentalPrice(productId, quantity, durationHours);
    return res.status(200).json(new ApiResponse(200, { finalPrice }, "Price calculated successfully"));
  } catch (error) {
    next(error);
  }
};
