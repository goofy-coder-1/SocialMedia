const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

router.get('/notifications', verifyToken, getNotifications);
router.patch('/notifications/:id/read', verifyToken, markNotificationAsRead);
router.delete('/notifications/:id', verifyToken, deleteNotification);

module.exports = router;