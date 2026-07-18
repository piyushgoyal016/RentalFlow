import * as returnRepository from "../repositories/return.repository.js";
import * as rentalRepository from "../repositories/rental.repository.js";
import ApiError from "../utils/ApiError.js";

export const processReturn = async (rentalOrderId, data) => {
  const existing = await returnRepository.findByRentalOrderId(rentalOrderId);
  if (existing) {
    throw new ApiError(400, "Return inspection already exists for this rental order");
  }

  const rental = await rentalRepository.findById(rentalOrderId);
  if (!rental) throw new ApiError(404, "Rental order not found");
  if (rental.status === "COMPLETED") throw new ApiError(400, "Rental order is already completed");

  const inspectionData = {
    rentalOrderId,
    isDamaged: data.isDamaged || false,
    damageReport: data.damageReport || null,
    missingAccessories: data.missingAccessories || null
  };

  return await returnRepository.createReturnWithRestock(inspectionData, rental.items);
};

export const getReturnInspection = async (id) => {
  const inspection = await returnRepository.findById(id);
  if (!inspection) throw new ApiError(404, "Return inspection not found");
  return inspection;
};

export const getAllReturns = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await returnRepository.findAll(skip, limit);
};
