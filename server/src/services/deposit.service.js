import * as depositRepository from "../repositories/deposit.repository.js";
import * as rentalRepository from "../repositories/rental.repository.js";
import ApiError from "../utils/ApiError.js";

export const collectDeposit = async (rentalOrderId, amount) => {
  const existing = await depositRepository.findByRentalOrderId(rentalOrderId);
  if (existing) {
    throw new ApiError(400, "Deposit record already exists for this rental order");
  }

  const rental = await rentalRepository.findById(rentalOrderId);
  if (!rental) throw new ApiError(404, "Rental order not found");

  return await depositRepository.create({
    rentalOrderId,
    amount
  });
};

export const getDeposit = async (id) => {
  const deposit = await depositRepository.findById(id);
  if (!deposit) throw new ApiError(404, "Deposit not found");
  return deposit;
};

export const getAllDeposits = async () => {
  return await depositRepository.findAll();
};

export const refundDeposit = async (id, refundAmount) => {
  const deposit = await depositRepository.findById(id);
  if (!deposit) throw new ApiError(404, "Deposit not found");
  if (deposit.isRefunded) throw new ApiError(400, "Deposit has already been refunded");
  if (refundAmount > deposit.amount) throw new ApiError(400, "Refund amount cannot exceed collected deposit");

  return await depositRepository.processRefund(id, refundAmount);
};
