import { z } from "zod";

export const collectDepositSchema = z.object({
  rentalOrderId: z.string().uuid(),
  amount: z.number().positive()
});

export const refundDepositSchema = z.object({
  refundAmount: z.number().positive()
});
