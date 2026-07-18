import express from "express";
import * as lateFeeController from "../controllers/lateFee.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { calculateFeeSchema } from "../validators/lateFee.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/charge",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  validate(calculateFeeSchema),
  lateFeeController.chargeLateFee
);

router.post(
  "/:id/pay",
  requireAuth,
  lateFeeController.payLateFee
);

router.get(
  "/",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  lateFeeController.getLateFees
);

export default router;
