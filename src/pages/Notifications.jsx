import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications here
    const fetchNotifications = async () => {
      try {
        // Add API call here
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>

        {notifications.length === 0 ? (
          <EmptyState message="No notifications yet" />
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
              >
                <p className="text-gray-800 dark:text-gray-200">{notification.message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Notifications;
