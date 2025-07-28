const express = require('express');
const User = require("../models/userModel.js")
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, getFriendRequests, deleteRequest } = require('../controllers/friendController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/friend-request/:userId', verifyToken, sendFriendRequest);
router.post('/friend-request/accept/:userId', verifyToken, acceptFriendRequest);
router.get('/friend-requests', verifyToken, getFriendRequests);
router.delete('/friend-requests/delete/:userId', verifyToken, deleteRequest);

router.get('/friends', verifyToken, async (req, res) => {
  try {
    console.log('User ID from token:', req.userId);  // ✅ Check if this is set
    const user = await User.findById(req.userId).populate('friends', 'name profilePic');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.friends);
  } catch (err) {
    console.error('❌ Error in /api/friends route:', err); // ✅ Log full error
    res.status(500).json({ message: 'Error fetching friends', error: err.message });
  }
});

module.exports = router;