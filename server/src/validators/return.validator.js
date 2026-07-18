export const processReturnSchema = {
  rentalOrderId: { required: true },
  isDamaged: { required: false }, // Boolean handled automatically in JS truthy, but typically we'd enforce type
  damageReport: { required: false },
  missingAccessories: { required: false }
};
