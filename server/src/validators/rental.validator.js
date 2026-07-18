export const createRentalSchema = {
  pickupDate: { required: true },
  returnDate: { required: true },
  items: { required: true } // Expecting array of {productId, quantity}
};

export const updateStatusSchema = {
  status: { required: true } // PENDING, ACTIVE, COMPLETED, OVERDUE, CANCELLED
};
