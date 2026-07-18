export const createPaymentSchema = {
  rentalOrderId: { required: true },
  amount: { required: true }
};

export const updatePaymentStatusSchema = {
  status: { required: true } // PENDING, COMPLETED, FAILED, REFUNDED
};
