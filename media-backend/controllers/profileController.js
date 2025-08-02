const User = require('../models/userModel');
const Post = require('../models/postModel');

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    return res.status(200).json({ user, posts });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { username, bio, birthdate } = req.body;
    const profilePicUrl = req.file?.path || req.file?.secure_url || null;

    const updates = {
      username,
      bio,
      birthdate,
      ...(profilePicUrl && { profilePic: profilePicUrl })
    };

    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};


module.exports = { getProfile, updateProfile };
