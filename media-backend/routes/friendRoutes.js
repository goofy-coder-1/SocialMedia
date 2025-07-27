const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, getFriendRequests, deleteRequest } = require('../controllers/friendController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/friend-request/:userId', verifyToken, sendFriendRequest);
router.post('/friend-request/accept/:userId', verifyToken, acceptFriendRequest);
router.get('/friend-requests', verifyToken, getFriendRequests);
router.delete('/friend-requests/delete/:userId', verifyToken, deleteRequest);
// 📬 GET all accepted friends (for inbox rendering)
router.get('/friends', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'name profilePic');
    res.status(200).json(user.friends);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching friends' });
  }
});

module.exports = router;