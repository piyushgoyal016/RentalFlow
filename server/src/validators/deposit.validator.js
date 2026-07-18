export const collectDepositSchema = {
  rentalOrderId: { required: true },
  amount: { required: true }
};

export const refundDepositSchema = {
  refundAmount: { required: true }
};
