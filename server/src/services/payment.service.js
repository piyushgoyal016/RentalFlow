import * as paymentRepository from "../repositories/payment.repository.js";
import * as rentalRepository from "../repositories/rental.repository.js";
import ApiError from "../utils/ApiError.js";

export const createPayment = async (rentalOrderId, amount) => {
  const existing = await paymentRepository.findByRentalOrderId(rentalOrderId);
  if (existing) {
    throw new ApiError(400, "Payment record already exists for this rental order");
  }
  
  const rental = await rentalRepository.findById(rentalOrderId);
  if (!rental) throw new ApiError(404, "Rental order not found");

  return await paymentRepository.create({
    rentalOrderId,
    amount
  });
};

export const getPayment = async (id) => {
  const payment = await paymentRepository.findById(id);
  if (!payment) throw new ApiError(404, "Payment not found");
  return payment;
};

export const updatePaymentStatus = async (id, status) => {
  const payment = await paymentRepository.findById(id);
  if (!payment) throw new ApiError(404, "Payment not found");

  // Simulating Invoice Generation when status is COMPLETED
  let invoiceUrl = payment.invoiceUrl;
  if (status === "COMPLETED" && !invoiceUrl) {
    invoiceUrl = `https://rentalflow.example.com/invoices/${payment.id}.pdf`;
  }

  return await paymentRepository.updateStatus(id, status, invoiceUrl);
};

export const refundPayment = async (id) => {
  const payment = await paymentRepository.findById(id);
  if (!payment) throw new ApiError(404, "Payment not found");
  if (payment.status !== "COMPLETED") throw new ApiError(400, "Cannot refund a payment that is not completed");

  return await paymentRepository.refund(id);
};
