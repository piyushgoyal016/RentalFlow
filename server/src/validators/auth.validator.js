import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters long" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters long" }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Must be a valid E.164 phone number" }).optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});
