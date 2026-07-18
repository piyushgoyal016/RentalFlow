import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  dashboardController.getStats
);

export default router;
