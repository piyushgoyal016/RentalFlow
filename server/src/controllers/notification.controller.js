import * as notificationService from "../services/notification.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.readNotification(id);
    return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
  } catch (error) {
    next(error);
  }
};

export const sendManualNotification = async (req, res, next) => {
  try {
    const { userId, type, message } = req.body;
    const notification = await notificationService.sendNotification(userId, type, message);
    return res.status(201).json(new ApiResponse(201, notification, "Notification sent successfully"));
  } catch (error) {
    next(error);
  }
};
