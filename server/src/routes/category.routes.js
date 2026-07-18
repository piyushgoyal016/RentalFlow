import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRoles("ADMIN"),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getCategoryById);

router.put(
  "/:id",
  requireAuth,
  requireRoles("ADMIN"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  requireAuth,
  requireRoles("ADMIN"),
  categoryController.deleteCategory
);

export default router;
