const express = require('express');
const router = express.Router();
const { sendMessage, getConversation } = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/messages/:receiverId', verifyToken, sendMessage);
router.get('/messages/:userId', verifyToken, getConversation);

module.exports = router;