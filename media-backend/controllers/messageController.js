const Message = require('../models/messageModel');

const sendMessage = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { content } = req.body;

    const message = new Message({
      sender: req.userId,
      receiver: receiverId,
      content
    });

    await message.save();
    res.status(200).json({ message: 'Message sent successfully', data: message });
  } catch (err) {
    console.log('Send message error:', err.message);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: otherUserId },
        { sender: otherUserId, receiver: req.userId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.log('Fetch messages error:', err.message);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
};

module.exports = { sendMessage, getConversation };