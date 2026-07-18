import express from "express";
import * as depositController from "../controllers/deposit.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { collectDepositSchema, refundDepositSchema } from "../validators/deposit.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  validate(collectDepositSchema),
  depositController.collectDeposit
);

router.get(
  "/history",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  depositController.getDepositHistory
);

router.get("/:id", requireAuth, depositController.getDeposit);

router.post(
  "/:id/refund",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  validate(refundDepositSchema),
  depositController.refundDeposit
);

export default router;
