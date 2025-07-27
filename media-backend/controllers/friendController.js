const User = require("../models/userModel");

const sendFriendRequest = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const senderId = req.userId;

    // Prevent self-request
    if (senderId === targetUserId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
    }

    const targetUser = await User.findById(targetUserId);
    const senderUser = await User.findById(senderId);

    if (!targetUser || !senderUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // ✅ Check if they are already friends
    if (
      targetUser.friends.includes(senderId) ||
      senderUser.friends.includes(targetUserId)
    ) {
      return res.status(400).json({ message: 'You are already friends.' });
    }

    // ✅ Check if request already sent
    if (targetUser.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    // ✅ Add request
    targetUser.friendRequests.push(senderId);
    await targetUser.save();

    res.status(200).json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Server error sending friend request.' });
  }
};


const acceptFriendRequest = async (req, res) => {
  try {
    const requesterId = req.params.userId;
    const receiver = await User.findById(req.userId);

    if (!receiver.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No pending request from this user" });
    }

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== requesterId);
    receiver.friends.push(requesterId);

    const sender = await User.findById(requesterId);
    sender.friends.push(req.userId);

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Friend request accepted!" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting request" });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const requesterId = req.params.userId;
    const receiver = await user.findById(req.userId);

    if (!receiver.friendRequests.includes(requesterId)) {
      return res.status(400).json({message: "No pending request from this user"});
    }

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== requesterId);
    await receiver.save();
    res.status(200).json({message: "Friend request declined"});
  } catch (err) {
    res.status(500).json({message: "Error deleting request"});
  }
}

const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friendRequests', 'name profilePic');
    res.status(200).json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  deleteRequest
};