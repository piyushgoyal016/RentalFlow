import * as lateFeeRepository from "../repositories/lateFee.repository.js";
import * as returnRepository from "../repositories/return.repository.js";
import ApiError from "../utils/ApiError.js";

const LATE_FEE_PER_DAY = 15.0; // Base config

export const calculateAndChargePenalty = async (returnInspectionId) => {
  const inspection = await returnRepository.findById(returnInspectionId);
  if (!inspection) throw new ApiError(404, "Return inspection not found");
  
  if (inspection.lateFee) throw new ApiError(400, "Late fee already calculated for this return");

  const rental = inspection.rentalOrder;
  const expectedReturn = new Date(rental.returnDate);
  const actualReturn = new Date(inspection.returnedAt);

  const diffTime = actualReturn - expectedReturn;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    throw new ApiError(400, "Item was not returned late, no fee applicable");
  }

  // Calculate based on days late and fixed config (could be extended to hourly)
  const penaltyAmount = diffDays * LATE_FEE_PER_DAY;

  return await lateFeeRepository.create({
    returnInspectionId,
    daysLate: diffDays,
    penaltyAmount
  });
};

export const payLateFee = async (id) => {
  const fee = await lateFeeRepository.findById(id);
  if (!fee) throw new ApiError(404, "Late fee not found");
  if (fee.isPaid) throw new ApiError(400, "Late fee is already paid");

  return await lateFeeRepository.markAsPaid(id);
};

export const getAllLateFees = async () => {
  return await lateFeeRepository.findAll();
};
