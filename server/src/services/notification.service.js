import * as notificationRepository from "../repositories/notification.repository.js";
import ApiError from "../utils/ApiError.js";

export const sendNotification = async (userId, type, message) => {
  // Simulating sending an email/SMS here based on `type`
  console.log(`[NOTIFICATION] Sending ${type} to user ${userId}: ${message}`);
  
  return await notificationRepository.create({
    userId,
    type,
    message
  });
};

export const getUserNotifications = async (userId) => {
  return await notificationRepository.findAllByUserId(userId);
};

export const readNotification = async (id) => {
  return await notificationRepository.markAsRead(id);
};
