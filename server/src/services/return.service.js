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
    // Overdue! Fetch global settings
    const settings = await prisma.globalSettings.findFirst();
    const isGlobalLateFeeEnabled = settings ? settings.lateFeeEnabled : true;
    const defaultLateFeeRate = settings ? settings.defaultLateFeeRate : 150.0;

    const diffTime = actualReturn.getTime() - expectedReturn.getTime();
    const hoursLate = Math.ceil(diffTime / (1000 * 60 * 60)) || 1; // Round up to nearest hour

    let totalPenalty = 0;
    
    // Sum penalties for each product
    for (const item of rental.items) {
      const product = await productRepository.findById(item.productId);
      if (product) {
        // If late fee is enabled for this product specifically or globally (when not overridden)
        const isLateFeeEnabled = product.lateFeeEnabled !== undefined ? product.lateFeeEnabled : isGlobalLateFeeEnabled;
        
        if (isLateFeeEnabled) {
          const rate = product.lateFeeRate !== null && product.lateFeeRate !== undefined 
            ? product.lateFeeRate 
            : defaultLateFeeRate;
            
          totalPenalty += hoursLate * rate * item.quantity;
        }
      }
    }

    if (totalPenalty > 0) {
      const lateFeesProduct = await prisma.product.findUnique({
        where: { barcode: 'LATE_FEES_SERVICE' }
      });

      if (lateFeesProduct) {
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
