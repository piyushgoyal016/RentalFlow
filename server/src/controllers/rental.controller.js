import * as rentalService from "../services/rental.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const rentProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const rentalOrder = await rentalService.rentProduct(userId, req.body);
    return res.status(201).json(new ApiResponse(201, rentalOrder, "Rental order created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getMyRentals = async (req, res, next) => {
  try {
    const rentals = await rentalService.getRentalOrders(req.user);
    return res.status(200).json(new ApiResponse(200, rentals, "Rentals fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllRentals = async (req, res, next) => {
  try {
    const rentals = await rentalService.getRentalOrders(req.user);
    return res.status(200).json(new ApiResponse(200, rentals, "All rentals fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getRentalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rental = await rentalService.getRentalOrderById(id, req.user);
    return res.status(200).json(new ApiResponse(200, rental, "Rental fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateRentalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedRental = await rentalService.updateRentalStatus(id, status);
    return res.status(200).json(new ApiResponse(200, updatedRental, "Rental status updated"));
  } catch (error) {
    next(error);
  }
};
