import * as pricelistRepository from "../repositories/pricelist.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import ApiError from "../utils/ApiError.js";

export const createPricelist = async (data) => {
  return await pricelistRepository.createPricelist(data);
};

export const getPricelists = async () => {
  return await pricelistRepository.findAll();
};

export const getPricelistById = async (id) => {
  const pricelist = await pricelistRepository.findById(id);
  if (!pricelist) throw new ApiError(404, "Pricelist not found");
  return pricelist;
};

export const updatePricelist = async (id, data) => {
  const pricelist = await pricelistRepository.findById(id);
  if (!pricelist) throw new ApiError(404, "Pricelist not found");
  return await pricelistRepository.updatePricelist(id, data);
};

export const deletePricelist = async (id) => {
  const pricelist = await pricelistRepository.findById(id);
  if (!pricelist) throw new ApiError(404, "Pricelist not found");
  return await pricelistRepository.deletePricelist(id);
};

// Pricing engine: calculates custom pricing using rules
export const resolveRentalPrice = async (productId, quantity, durationHours) => {
  const product = await productRepository.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const rules = await pricelistRepository.findActiveRules(productId, product.categoryId);

  // If no pricelist rules apply, default to the product's base price per day
  const basePricePerDay = product.rentalPricePerDay;
  
  if (rules.length === 0) {
    // Default Daily Rate calculation
    const days = Math.ceil(durationHours / 24) || 1;
    return basePricePerDay * days * quantity;
  }

  // Find the most specific rule that fits the quantity and periodicity context
  // Rules are already sorted with product-specific rules first, then category, then global fallback.
  for (const rule of rules) {
    if (quantity >= rule.minQty) {
      // Calculate rate based on periodicity
      let periods = 1;
      switch (rule.periodicity.toUpperCase()) {
        case "HOURLY":
          periods = durationHours;
          break;
        case "NIGHTLY":
        case "DAILY":
          periods = Math.ceil(durationHours / 24);
          break;
        case "WEEKLY":
          periods = Math.ceil(durationHours / (24 * 7));
          break;
        case "MONTHLY":
          periods = Math.ceil(durationHours / (24 * 30));
          break;
        default:
          periods = Math.ceil(durationHours / 24);
      }

      // Safeguard periodicity if it's 0 or negative
      periods = Math.max(1, Math.ceil(periods));

      if (rule.priceType === "FIXED" && rule.fixedPrice !== null) {
        return rule.fixedPrice * periods * quantity;
      } else if (rule.priceType === "RANGE" && rule.minPrice !== null) {
        // Fall back to minPrice for range
        return rule.minPrice * periods * quantity;
      }
    }
  }

  // Fallback to base daily rate if rules didn't match quantity criteria
  const days = Math.ceil(durationHours / 24) || 1;
  return basePricePerDay * days * quantity;
};
