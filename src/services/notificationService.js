import API from './api';

const notificationService = {
  // Get all notifications for current user
  getNotifications: async (page = 1, limit = 10) => {
    try {
      const response = await API.get('/notifications', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await API.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await API.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await API.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await API.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default notificationService;
