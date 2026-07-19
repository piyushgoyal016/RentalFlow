import * as returnRepository from "../repositories/return.repository.js";
import * as rentalRepository from "../repositories/rental.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/db.js";

export const processReturn = async (rentalOrderId, data) => {
  const existing = await returnRepository.findByRentalOrderId(rentalOrderId);
  if (existing) {
    throw new ApiError(400, "Return inspection already exists for this rental order");
  }

  const rental = await rentalRepository.findById(rentalOrderId);
  if (!rental) throw new ApiError(404, "Rental order not found");
  if (rental.status === "COMPLETED") throw new ApiError(400, "Rental order is already completed");

  const inspectionData = {
    rentalOrderId,
    isDamaged: data.isDamaged || false,
    damageReport: data.damageReport || null,
    missingAccessories: data.missingAccessories || null
  };

  // 1. Calculate Late Fees
  const expectedReturn = new Date(rental.returnDate);
  const actualReturn = new Date();
  
  let lateFeeData = null;

  if (actualReturn.getTime() > expectedReturn.getTime()) {
    // Fetch settings + all products for this rental in PARALLEL (eliminates N+1)
    const productIds = rental.items.map(i => i.productId);

    const [settings, products, lateFeesProduct] = await Promise.all([
      prisma.globalSettings.findFirst(),
      prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, lateFeeEnabled: true, lateFeeRate: true }
      }),
      prisma.product.findUnique({
        where: { barcode: 'LATE_FEES_SERVICE' },
        select: { id: true }
      }),
    ]);

    const isGlobalLateFeeEnabled = settings?.lateFeeEnabled ?? true;
    const defaultLateFeeRate     = settings?.defaultLateFeeRate ?? 150.0;
    const gracePeriodMs          = (settings?.gracePeriodMinutes ?? 0) * 60 * 1000;
    const maxLateFeeAmount       = settings?.maxLateFeeAmount ?? null;

    const diffTime = actualReturn.getTime() - expectedReturn.getTime();

    if (diffTime > gracePeriodMs) {
      const effectiveDiff = diffTime - gracePeriodMs;
      const hoursLate = Math.ceil(effectiveDiff / (1000 * 60 * 60)) || 1;

      // Build a product lookup map (O(1) access instead of O(n) per item)
      const productMap = Object.fromEntries(products.map(p => [p.id, p]));

      let totalPenalty = 0;
      for (const item of rental.items) {
        const product = productMap[item.productId];
        if (product) {
          const isLateFeeEnabled = product.lateFeeEnabled ?? isGlobalLateFeeEnabled;
          if (isLateFeeEnabled) {
            const rate = product.lateFeeRate ?? defaultLateFeeRate;
            totalPenalty += hoursLate * rate * item.quantity;
          }
        }
      }

      if (maxLateFeeAmount !== null && totalPenalty > maxLateFeeAmount) {
        totalPenalty = maxLateFeeAmount;
      }

      if (totalPenalty > 0 && lateFeesProduct) {
        lateFeeData = {
          hoursLate,
          penaltyAmount: totalPenalty,
          productId: lateFeesProduct.id
        };
      }
    }
  }

  return await returnRepository.createReturnWithRestock(inspectionData, rental.items, lateFeeData);
};

export const getReturnInspection = async (id) => {
  const inspection = await returnRepository.findById(id);
  if (!inspection) throw new ApiError(404, "Return inspection not found");
  return inspection;
};

export const getAllReturns = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await returnRepository.findAll(skip, limit);
};
