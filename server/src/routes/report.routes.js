import express from "express";
import * as reportController from "../controllers/report.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(requireAuth, requireRoles("ADMIN", "MANAGER", "VENDOR"));

router.get("/revenue", reportController.getRevenueReport);
router.get("/rentals", reportController.getRentalReport);
router.get("/customers", reportController.getCustomerReport);
router.get("/products", reportController.getProductReport);

export default router;
