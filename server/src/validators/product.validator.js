import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3),
  categoryId: z.string().uuid(),
  rentalPricePerDay: z.number().positive(),
  depositAmount: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative().optional().default(1),
  description: z.string().optional(),
  barcode: z.string().optional(),
  qrCode: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).optional(),
  rentalPricePerDay: z.number().positive().optional(),
  depositAmount: z.number().nonnegative().optional(),
  isAvailable: z.boolean().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
});
