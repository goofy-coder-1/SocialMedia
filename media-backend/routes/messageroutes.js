const express = require('express');
const router = express.Router();
const { sendMessage, getConversation } = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/messages/:receiverId', verifyToken, sendMessage); // send message
router.get('/messages/:userId', verifyToken, getConversation);  // get chat history

module.exports = router;