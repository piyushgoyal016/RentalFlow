import { z } from "zod";

export const createPaymentSchema = z.object({
  rentalOrderId: z.string().uuid(),
  amount: z.number().positive()
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"])
});
