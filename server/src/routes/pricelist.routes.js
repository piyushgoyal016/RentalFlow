import express from "express";
import * as pricelistController from "../controllers/pricelist.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", requireRoles("ADMIN", "MANAGER"), pricelistController.createPricelist);
router.get("/", pricelistController.getPricelists);
router.get("/:id", pricelistController.getPricelistById);
router.put("/:id", requireRoles("ADMIN", "MANAGER"), pricelistController.updatePricelist);
router.delete("/:id", requireRoles("ADMIN"), pricelistController.deletePricelist);
router.post("/calculate", pricelistController.testResolvePrice);

export default router;
