import { z } from "zod";

const variantSchema = z.object({
  name: z.string(),
  value: z.string(),
  imageUrl: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(3),
  categoryId: z.string().uuid(),
  rentalPricePerDay: z.number().positive(),
  depositAmount: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative().optional().default(1),
  description: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  qrCode: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  lateFeeEnabled: z.boolean().optional(),
  lateFeeRate: z.number().nullable().optional(),
  paddingTime: z.number().int().nullable().optional(),
  variants: z.array(variantSchema).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).optional(),
  rentalPricePerDay: z.number().positive().optional(),
  depositAmount: z.number().nonnegative().optional(),
  isAvailable: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  description: z.string().nullable().optional(),
  lateFeeEnabled: z.boolean().optional(),
  lateFeeRate: z.number().nullable().optional(),
  paddingTime: z.number().int().nullable().optional(),
});
