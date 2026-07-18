import * as rentalRepository from "../repositories/rental.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import ApiError from "../utils/ApiError.js";

export const calculateRentalCost = (pickupDate, returnDate, items) => {
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

  let totalItemCostPerDay = 0;
  items.forEach(item => {
    totalItemCostPerDay += item.pricePerDay * item.quantity;
  });

  return diffDays * totalItemCostPerDay;
};

export const rentProduct = async (userId, rentalData) => {
  // 1. Verify products and get prices
  const itemsWithPrices = [];
  for (const item of rentalData.items) {
    const product = await productRepository.findById(item.productId);
    if (!product) throw new ApiError(404, `Product ${item.productId} not found`);
    if (!product.isAvailable || product.stockQuantity < item.quantity) {
      throw new ApiError(400, `Product ${product.name} is not available in requested quantity`);
    }
    
    itemsWithPrices.push({
      productId: item.productId,
      quantity: item.quantity,
      pricePerDay: product.rentalPricePerDay
    });
  }

  // 2. Calculate Total Cost
  const totalCost = calculateRentalCost(rentalData.pickupDate, rentalData.returnDate, itemsWithPrices);

  // 3. Create Rental Order
  const orderData = {
    userId,
    pickupDate: rentalData.pickupDate,
    returnDate: rentalData.returnDate,
    totalCost,
    items: itemsWithPrices
  };

  return await rentalRepository.createRentalOrder(orderData);
};

export const getRentalOrders = async (user, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await rentalRepository.findAll(user.id, user.role, skip, limit);
};

export const getRentalOrderById = async (id, user) => {
  const order = await rentalRepository.findById(id);
  if (!order) throw new ApiError(404, "Rental order not found");
  
  if (user.role === "CUSTOMER" && order.userId !== user.id) {
    throw new ApiError(403, "Access denied to this rental order");
  }
  return order;
};

export const updateRentalStatus = async (id, status) => {
  const order = await rentalRepository.findById(id);
  if (!order) throw new ApiError(404, "Rental order not found");
  return await rentalRepository.updateStatus(id, status);
};
