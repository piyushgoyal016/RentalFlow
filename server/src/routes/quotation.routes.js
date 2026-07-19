import express from "express";
import * as quotationController from "../controllers/quotation.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/",    requireAuth, quotationController.getAll);
router.get("/:id", requireAuth, quotationController.getById);
router.post("/",   requireAuth, requireRoles("ADMIN", "MANAGER"), quotationController.create);
router.put("/:id", requireAuth, requireRoles("ADMIN", "MANAGER"), quotationController.update);
router.delete("/:id", requireAuth, requireRoles("ADMIN"), quotationController.remove);

export default router;
