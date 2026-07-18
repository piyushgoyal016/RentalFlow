import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sendNotificationSchema } from "../validators/notification.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Get own notifications
router.get("/my", requireAuth, notificationController.getMyNotifications);

// Mark as read
router.patch("/:id/read", requireAuth, notificationController.markAsRead);

// Admin send manual notification
router.post(
  "/send",
  requireAuth,
  requireRoles("ADMIN", "MANAGER"),
  validate(sendNotificationSchema),
  notificationController.sendManualNotification
);

export default router;
