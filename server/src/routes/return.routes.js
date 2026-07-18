import express from "express";
import * as returnController from "../controllers/return.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { processReturnSchema } from "../validators/return.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  validate(processReturnSchema),
  returnController.processReturn
);

router.get(
  "/",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  returnController.getAllReturns
);

router.get("/:id", requireAuth, returnController.getReturn);

export default router;
