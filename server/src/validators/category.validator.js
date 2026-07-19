import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
