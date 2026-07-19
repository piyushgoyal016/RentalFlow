import { z } from "zod";

export const processReturnSchema = z.object({
  rentalOrderId: z.string().uuid(),
  isDamaged: z.boolean().optional().default(false),
  damageReport: z.string().optional(),
  missingAccessories: z.string().optional()
});
