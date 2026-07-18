import { z } from "zod";

export const createRentalSchema = z.object({
  pickupDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid pickupDate" }),
  returnDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid returnDate" }),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive()
    })
  ).min(1, { message: "At least one item is required" })
});

export const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "OVERDUE", "CANCELLED"])
});
