import api from "./api";

export const notificationService = {
  async getMyNotifications() {
    try {
      const response = await api.get("/notifications");
      if (response.data?.success) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.error("Backend getMyNotifications failed:", err);
      return [];
    }
  },
  
  async markAsRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      return true;
    } catch (err) {
      console.error("Backend markAsRead failed:", err);
      return false;
    }
  }
};

export default notificationService;
