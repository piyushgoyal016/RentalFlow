import express from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(requireAuth); // All user endpoints require authentication

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.post("/change-password", userController.changePassword);

// Admin endpoints
router.get("/", requireRoles("ADMIN", "MANAGER"), userController.getAllUsers);
router.post("/", requireRoles("ADMIN", "MANAGER"), userController.createUser);

export default router;
