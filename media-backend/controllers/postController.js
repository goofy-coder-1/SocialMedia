const Post = require('../models/postModel');
const Notification = require('../models/notificationModal.js');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Content required' });

    const post = new Post({
      author: req.userId,
      content,
      photo: req.file?.path
    });

    await post.save();
    res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    res.status(500).json({ message: 'Creation failed' });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePic')
      .populate('comments.author', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
};

// Like or unlike a post

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const liked = post.likes.includes(req.userId);
    
    if (liked) {
      post.likes.pull(req.userId);
    } else {
      post.likes.push(req.userId);

      // 🔔 Only create notification if someone else liked the post
      if (req.userId !== post.author.toString()) {
        const notification = new Notification({
          recipient: post.author,
          sender: req.userId,
          type: 'like',
          post: post._id
        });
        await notification.save();
      }
    }

    await post.save();
    res.json({ liked: !liked, likesCount: post.likes.length });
  } catch (err) {
    console.error('Like post error:', err.message);
    res.status(500).json({ message: 'Error liking post' });
  }
};

// Add a comment to a post 

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Comment required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = { text, author: req.userId };
    post.comments.push(comment);

    // 🔔 Notify post author if someone else commented
    if (req.userId !== post.author.toString()) {
      const notification = new Notification({
        recipient: post.author,
        sender: req.userId,
        type: 'comment',
        post: post._id
      });

      await notification.save();
    }

    await post.save();
    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    console.error('Comment error:', err.message);
    res.status(500).json({ message: 'Comment error' });
  }
};

// Edit a post
const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    post.content = req.body.content || post.content;
    if (req.file?.path) post.photo = req.file.path;
    await post.save();

    res.json({ message: 'Updated', post });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    await post.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// Edit a comment
const editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    const comment = post?.comments.id(commentId);

    if (!comment || comment.author.toString() !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    comment.text = req.body.text;
    await post.save();
    res.json({ message: 'Comment updated', comment });
  } catch (err) {
    res.status(500).json({ message: 'Edit comment failed' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    const comment = post?.comments.id(commentId);

    if (!comment || comment.author.toString() !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    comment.remove();
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete comment failed' });
  }
};

// Export all controller functions
module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment,
  editPost,
  deletePost,
  editComment,
  deleteComment
};
