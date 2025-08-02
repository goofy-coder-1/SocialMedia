const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Post = require('../models/postModel');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// Update user profile
router.put('/profile/update', verifyToken, upload.single('profilePic'), updateProfile);

// Get logged-in user's profile and their posts with populated author and comments
router.get('/profile/me', verifyToken, async (req, res) => {
  try {
    // Fetch user excluding password field
    const user = await User.findById(req.userId).select('-password');

    const posts = await Post.find({ author: req.userId })
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePic')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name profilePic' }
      });

    res.status(200).json({ user, posts });
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

router.get('/search', verifyToken, async (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query) {
      return res.status(400).json({ message: 'Missing query parameter' });
    }

    // Find users 
    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    }).select('name profilePic bio');

    // Find posts 
    const posts = await Post.find({
      content: { $regex: query, $options: 'i' }
    })
      .populate('author', 'name profilePic')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name profilePic' }
      });

    res.status(200).json({ users, posts });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

// Public route to get any user's profile by ID
router.get('/profile/:id', getProfile);

module.exports = router;
