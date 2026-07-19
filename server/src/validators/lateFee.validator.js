import { z } from "zod";

export const calculateFeeSchema = z.object({
  returnInspectionId: z.string().uuid()
});
