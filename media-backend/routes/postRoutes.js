const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');


const {
  createPost,
  getPosts,
  likePost,
  addComment,
  deletePost,
  editPost,
  editComment,
  deleteComment
} = require('../controllers/postController');


//for creating post
router.post('/posts', verifyToken, upload.single('photo'), createPost);

// getting posts
router.get('/getposts', getPosts);

// for like
router.put('/posts/:id/like', verifyToken, likePost);

// for comments 
router.post('/posts/:id/comment', verifyToken, addComment);

//post modification
router.put('/posts/:id', verifyToken, upload.single('photo'), editPost);
router.delete('/posts/:id', verifyToken, deletePost);


//comment modification
router.put('/posts/:postId/comments/:commentId', verifyToken, editComment);
router.delete('/posts/:postId/comments/:commentId', verifyToken, deleteComment);

module.exports = router;