import express from "express";
import * as rentalController from "../controllers/rental.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createRentalSchema, updateStatusSchema } from "../validators/rental.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  validate(createRentalSchema),
  rentalController.rentProduct
);

router.get("/my", requireAuth, rentalController.getMyRentals);

router.get(
  "/",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  rentalController.getAllRentals
);

router.get("/:id", requireAuth, rentalController.getRentalById);

router.patch(
  "/:id/status",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  validate(updateStatusSchema),
  rentalController.updateRentalStatus
);

export default router;
