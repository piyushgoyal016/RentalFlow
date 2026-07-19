import { z } from "zod";

export const sendNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.string(),
  message: z.string().min(5)
});
