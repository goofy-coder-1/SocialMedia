const Notification = require('../models/notificationModal');

// 1️⃣ Get All Notifications for Logged-in User
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .populate('sender', 'name profilePic') // optional for frontend display
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// 2️⃣ Mark Notification as Read
const markNotificationAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
};

// 3️⃣ Delete a Notification
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

// Make sure to export them all
module.exports = {
  getNotifications,
  markNotificationAsRead,
  deleteNotification
};