export const sendNotificationSchema = {
  userId: { required: true },
  type: { required: true },
  message: { required: true, minLength: 5 }
};
