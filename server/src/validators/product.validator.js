export const createProductSchema = {
  name: { required: true, minLength: 3 },
  categoryId: { required: true },
  rentalPricePerDay: { required: true },
  depositAmount: { required: true },
  stockQuantity: { required: false }
};

export const updateProductSchema = {
  name: { required: false, minLength: 3 },
  rentalPricePerDay: { required: false },
  depositAmount: { required: false },
  isAvailable: { required: false }
};
