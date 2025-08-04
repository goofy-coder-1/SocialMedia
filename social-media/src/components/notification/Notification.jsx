import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../notification/Notification.css';
import { baseUrl } from '../../../url';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  //  Load notifications when component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/pop/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching notifications:', err.response?.data || err.message);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  //  Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(`${baseUrl}/api/pop/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications((prev) =>
        prev.map((notif) => notif._id === id ? { ...notif, isRead: true } : notif)
      );
    } catch (err) {
      console.error('Error marking as read:', err.message);
    }
  };

  //  Delete a notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/pop/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err.message);
    }
  };

  //  Format notification text
  const renderMessage = (type, senderName) => {
    switch (type) {
      case 'like': return `${senderName} liked your post.`;
      case 'comment': return `${senderName} commented on your post.`;
      case 'friendRequest': return `${senderName} sent you a friend request.`;
      case 'message': return `${senderName} sent you a message.`;
      default: return 'You have a new notification.';
    }
  };

 
 if (isLoading) {
  return (
    <div className="loading-screen">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );
}


  return (
    <div className="container-fluid notification-here">
      <div className="notifications">
        <h3 className="text-center" style={{fontFamily: 'Orbitron', fontSize: '2rem'}}> Notifications</h3>

        {notifications.length === 0 ? (
          <div className="alert alert-secondary mt-3">No notifications yet.</div>
        ) : (
          <ul className="list-unstyled">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className={`border rounded p-3 mb-3 ${notif.isRead ? 'bg-light' : 'bg-warning-subtle'}`}
              >
                <div className="d-flex justify-content-between align-items-center notify-div">
                  <div className="d-flex align-items-center rounded-circle">
                    <img
                      src={notif.sender?.profilePic || '/default-avatar.png'}
                      alt="avatar"
                      className="rounded-circle me-3"
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                    />
                    <div>
                      <strong>{renderMessage(notif.type, notif.sender?.name || 'Someone')}</strong>
                      <br />
                      <small className="text-muted">
                        {new Date(notif.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                  <div className='notify-actions'>
                    {!notif.isRead && (
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => markAsRead(notif._id)}
                      >
                         Read
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteNotification(notif._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;

