import * as rentalRepository from "../repositories/rental.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import * as pricelistService from "./pricelist.service.js";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/db.js";

// Availability check using sweep-line algorithm with padding time buffer
export const checkProductAvailability = async (productId, requestedQuantity, pickupDate, returnDate) => {
  const product = await productRepository.findById(productId);
  if (!product) throw new ApiError(404, `Product ${productId} not found`);

  const paddingMs = (product.paddingTime || 0) * 60 * 1000;
  const requestedStart = new Date(pickupDate).getTime();
  const requestedEnd = new Date(returnDate).getTime();

  // Find all active/booked/pending/reserved rentals for this product
  const activeItems = await prisma.rentalItem.findMany({
    where: {
      productId,
      rentalOrder: {
        status: {
          in: ["PENDING", "ACTIVE", "RESERVED", "BOOKED", "PICKED_UP", "OVERDUE"]
        }
      }
    },
    include: {
      rentalOrder: true
    }
  });

  const events = [];
  activeItems.forEach(item => {
    const start = new Date(item.rentalOrder.pickupDate).getTime() - paddingMs;
    const end = new Date(item.rentalOrder.returnDate).getTime() + paddingMs;
    // Check if the event's window overlaps our requested window
    if (start < requestedEnd && end > requestedStart) {
      events.push({ time: start, change: item.quantity });
      events.push({ time: end, change: -item.quantity });
    }
  });

  // Sort events: first by time, then by change (start events first)
  events.sort((a, b) => {
    if (a.time === b.time) {
      return b.change - a.change;
    }
    return a.time - b.time;
  });

  let currentOccupancy = 0;
  let maxOccupancy = 0;
  
  // Sweep line
  events.forEach(e => {
    currentOccupancy += e.change;
    if (e.time >= requestedStart && e.time <= requestedEnd) {
      if (currentOccupancy > maxOccupancy) {
        maxOccupancy = currentOccupancy;
      }
    }
  });

  // Check initial occupancy at requestedStart
  let occupancyAtStart = 0;
  events.forEach(e => {
    if (e.time <= requestedStart) {
      occupancyAtStart += e.change;
    }
  });
  
  const peakOccupancy = Math.max(maxOccupancy, occupancyAtStart);
  
  if (product.stockQuantity - peakOccupancy < requestedQuantity) {
    throw new ApiError(400, `Product "${product.name}" is fully booked during this period (including padding buffers)`);
  }
};

export const rentProduct = async (userId, rentalData) => {
  const start = new Date(rentalData.pickupDate);
  const end = new Date(rentalData.returnDate);
  const durationHours = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60)) || 1;

  // 1. Verify products, check availability & resolve prices
  const itemsWithPrices = [];
  let totalCost = 0;
  let totalDeposit = 0;

  for (const item of rentalData.items) {
    const product = await productRepository.findById(item.productId);
    if (!product) throw new ApiError(404, `Product ${item.productId} not found`);
    
    // Check overlapping availability (including padding buffer)
    await checkProductAvailability(item.productId, item.quantity, rentalData.pickupDate, rentalData.returnDate);

    // Resolve price based on pricelist rules
    const resolvedItemCost = await pricelistService.resolveRentalPrice(item.productId, item.quantity, durationHours);
    totalCost += resolvedItemCost;

    // Accumulate total deposit
    totalDeposit += (product.depositAmount || 0) * item.quantity;
    
    itemsWithPrices.push({
      productId: item.productId,
      quantity: item.quantity,
      pricePerDay: resolvedItemCost / item.quantity / (Math.ceil(durationHours / 24) || 1), // Store estimated price per day
      isService: false
    });
  }

  // 2. Fetch/Create Security Deposit service line if deposit > 0
  if (totalDeposit > 0) {
    const depositProduct = await prisma.product.findUnique({
      where: { barcode: 'SECURITY_DEPOSIT_SERVICE' }
    });
    
    if (depositProduct) {
      itemsWithPrices.push({
        productId: depositProduct.id,
        quantity: 1,
        pricePerDay: totalDeposit / (Math.ceil(durationHours / 24) || 1), // flat deposit
        isService: true
      });
      
      totalCost += totalDeposit;
    }
  }

  // 3. Create Rental Order
  const orderData = {
    userId,
    pickupDate: rentalData.pickupDate,
    returnDate: rentalData.returnDate,
    totalCost,
    depositAmount: totalDeposit,
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
  
  if (user.role.name === "CUSTOMER" && order.userId !== user.id) {
    throw new ApiError(403, "Access denied to this rental order");
  }
  return order;
};

export const updateRentalStatus = async (id, status) => {
  const order = await rentalRepository.findById(id);
  if (!order) throw new ApiError(404, "Rental order not found");
  return await rentalRepository.updateStatus(id, status);
};
