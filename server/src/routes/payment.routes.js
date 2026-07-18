import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createPaymentSchema, updatePaymentStatusSchema } from "../validators/payment.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  validate(createPaymentSchema),
  paymentController.createPayment
);

router.get("/:id", requireAuth, paymentController.getPayment);

router.patch(
  "/:id/status",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  validate(updatePaymentStatusSchema),
  paymentController.updatePaymentStatus
);

router.post(
  "/:id/refund",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  paymentController.refundPayment
);

export default router;
