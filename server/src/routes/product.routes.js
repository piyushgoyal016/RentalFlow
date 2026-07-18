import express from "express";
import * as productController from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  validate(createProductSchema),
  productController.createProduct
);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.put(
  "/:id",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete(
  "/:id",
  requireAuth,
  requireRoles("ADMIN"),
  productController.deleteProduct
);

router.patch(
  "/:id/availability",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  productController.toggleAvailability
);

export default router;
