import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import PostForm from '../PostForm/postForm';
import { PostContext } from '/src/contextapi/postcontext.jsx';
import { SlLike } from "react-icons/sl";
import { useFriendContext } from '/src/contextapi/Friendcontext.jsx';
import '../Home/Home.css';
import { toast } from 'react-toastify';
import { baseUrl } from '../../../url';

const Home = () => {
  const { posts, setPosts, handlePostCreated } = useContext(PostContext);
  const [blogs, setBlogs] = useState([]);
  const [commentText, setCommentText] = useState({});
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [showAllComments, setShowAllComments] = useState({});
  const [friends, setFriends] = useState([])
  const { refreshFriends } = useFriendContext();
  const [loading, setLoading] = useState(true);
const [editingCommentId, setEditingCommentId] = useState(null);
const [editedCommentText, setEditedCommentText] = useState('');
const [openMenuForCommentId, setOpenMenuForCommentId] = useState(null);

const handleRequest = () => {
    toast.info('This section is still under construction, we will let you know when its completed')
  }
  
  const handleEditComment = async (postId, commentId) => {
  try {
    await axios.put(
      `${baseUrl}/api/postsapi/posts/${postId}/comments/${commentId}`,
      { text: editedCommentText },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEditingCommentId(null);
    setEditedCommentText('');
    loadContent(); // Refresh posts
  } catch (err) {
    console.error('Error editing comment:', err);
  }
};

const handleDeleteComment = async (postId, commentId) => {
  if (!window.confirm('Are you sure you want to delete this comment?')) return;

  try {
    console.log("Deleting comment", commentId, "from post", postId);

    const res = await axios.delete(
      `${baseUrl}/api/postsapi/posts/${postId}/comments/${commentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Comment deleted:", res.data);
    toast.success('comment deleted')
    loadContent(); 
  } catch (err) {
    console.error("Delete error:", err.response?.status, err.response?.data || err.message);
    toast.error('deletion failed')
  }
};


useEffect(() => {
   setLoading(true);
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFriends(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch friends:', err.message);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchFriends();
  }, [refreshFriends]);

  const toggleCommentView = (postId) => {
  setShowAllComments((prev) => ({
    ...prev,
    [postId]: !prev[postId],
  }));
};

  useEffect(() => {
    if (location.pathname === '/') {
      loadContent();
      fetchBlogs();
    }
  }, [location.pathname]);
 
  const loadContent = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/postsapi/getposts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setPosts([]);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('https://newsdata.io/api/1/news', {
        params: {
          apikey: 'pub_3a78d54f117d46949826390804bc4aa8',
          q: 'science',
          language: 'en',
          country: 'us',
          category: 'science',
        },
      });

      const articles = res.data.results.map(item => ({
        _id: item.link,
        content: item.title,
        image: item.image_url,
        link: item.link,
        createdAt: item.pubDate,
        likes: [],
        comments: [],
      }));

      setBlogs(articles);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setBlogs([]);
    }
  };

 
  const handleLike = async (postId) => {
    try {
      await axios.put(
        `${baseUrl}/api/postsapi/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadContent();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      await axios.post(
        `${baseUrl}/api/postsapi/posts/${postId}/comment`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      loadContent();
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  return (
    <div className="home-wrapper">
      {/* Left Sidebar for simple controls*/}
      <div className="sidebar">
        <ul style={{padding: '20px'}}>
          <li style={{fontSize: '20px'}} onClick={handleRequest}>🔖 Bookmarks</li>
          <Link to='/requests' style={{color: 'inherit', textDecoration:'none'}}><li className='lists'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Requests</li></Link>
          <Link to='/sendcode' style={{color: 'inherit', textDecoration:'none'}}> <li className='lists'>⚙️ Settings</li></Link>
          <Link to='/profile' style={{color: 'inherit', textDecoration:'none'}}><li className='lists'>👤 Profile</li></Link>
        </ul>
      </div>

       {/* main feed which is used to show posts along with blogs  */}
      <main className="feed">
        <h2>Create a Post</h2>
        <PostForm onPostCreated={handlePostCreated} />

        <h2>Recent Posts</h2>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post-card" style={{ marginBottom: '24px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
              
              {/* Post Author */}
              <div style={{ display: 'flex', marginBottom: '10px', justifyContent: 'flex-start' }} className='author-content'>
                <div className='author-top-content'>
                  
                <img
                  src={post.author?.profilePic || '/default-avatar.png'}
                  style={{
                    width: '50px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '12px',
                  }}
                  className='author-dai'
                />
                <h3 style={{ fontWeight: '600', fontSize: '1.5rem' }} className='authors-name'>
                  {post.author?.name || 'Unknown Author'}
                </h3>
                  
              </div>
              </div>

              {/* Post Content */}
              <p style={{ marginBottom: '8px' }}>{post.content}</p>
              {post.photo && (
                <img
                  src={post.photo}
                  alt="Post"
                  className="post-image"
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    marginTop: '10px',
                    borderRadius: '8px',
                  }}
                />
              )}
              <small style={{ color: '#666' }}>{new Date(post.createdAt).toLocaleString()}</small>

              {/* Like Button */}
              <div className='actions'>
              <div className="like-button" style={{ marginTop: '10px' }}>
                <button className="like-button" onClick={() => handleLike(post._id)} style={{ cursor: 'pointer' }}>
                  <SlLike/> {post.likes?.length || 0}
                </button>
              </div>

              {/* Comment Input */}
              <div className="comment-section" style={{ marginTop: '16px'}}>
                <div>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post._id] || ''}
                  className='comment-input'
                  onChange={(e) =>
                    setCommentText(prev => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                  style={{ padding: '6px 8px', width: '70%', marginRight: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                </div>
                <div>
                <button className='comment-button' onClick={() => handleComment(post._id)} style={{ padding: '6px 12px', cursor: 'pointer' }}>
                  Comment
                </button>
                </div>
              </div>
              </div>

              {/* Comments List */}
              <div className="comments-list" style={{ marginTop: '16px' }}>
{(showAllComments[post._id] ? post.comments : post.comments.slice(0, 1)).map((comment, index) => (
  <div key={index} className="comment" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', position: 'relative' }}>
    <img
      src={comment.author?.profilePic || '/default-avatar.png'}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: '10px',
        marginTop: '4px',
      }}
    />
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{comment.author?.name || 'Unknown'}</span>

        {/* Three dots menu (only for current user) */}
        {comment.author?._id === JSON.parse(localStorage.getItem('user'))._id && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenMenuForCommentId(openMenuForCommentId === comment._id ? null : comment._id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              ⋯
            </button>

            {openMenuForCommentId === comment._id && (
              <div style={{
                position: 'absolute',
                right: 0,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px',
                zIndex: 100,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                <div
                  style={{ cursor: 'pointer', padding: '4px 8px' }}
                  onClick={() => {
                    setEditingCommentId(comment._id);
                    setEditedCommentText(comment.text);
                    setOpenMenuForCommentId(null);
                  }}
                >
                   Edit
                </div>
                <div
                  style={{ cursor: 'pointer', padding: '4px 8px', color: 'red' }}
                  onClick={() => {
                    handleDeleteComment(post._id, comment._id);
                    setOpenMenuForCommentId(null);
                  }}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editable or normal view */}
      {editingCommentId === comment._id ? (
        <>
          <input
            type="text"
            value={editedCommentText}
            onChange={(e) => setEditedCommentText(e.target.value)}
            style={{ width: '100%', margin: '4px 0', padding: '4px' }}
          />
          <div style={{ marginTop: '4px' }}>
            <button onClick={() => handleEditComment(post._id, comment._id)} style={{ marginRight: '8px' }}>Save</button>
            <button onClick={() => setEditingCommentId(null)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <p style={{ margin: '4px 0' }}>{comment.text}</p>
          <small style={{ fontSize: '0.8rem', color: '#555' }}>
            {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
          </small>
        </>
      )}
    </div>
  </div>
))}

{post.comments.length > 1 && (
  <button
    className="btn btn-link btn-sm"
    onClick={() => toggleCommentView(post._id)}
  >
    {showAllComments[post._id] ? 'Hide Comments' : 'View All Comments'}
  </button>
)}

</div>
            </div>
          ))
        )}

        {/* Blogs Section */}
        <h2>Latest Blogs</h2>
        {blogs.length === 0 ? (
          <p>No blogs available.</p>
        ) : (
          blogs.map(blog => (
            <div key={blog._id} className="post-card" style={{ marginBottom: '20px' }}>
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.content}
                  className="blog-image"
                  style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '10px' }}
                />
              )}
              <p>{blog.content}</p>
              <small>{new Date(blog.createdAt).toLocaleString()}</small>
              <br />
              <a href={blog.link} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          ))
        )}
      </main>

      {/* Right Sidebar */}
  <div className="inbox-container">
      {friends.length === 0 ? (
        <div className="alert alert-secondary mt-3">No friends to message yet.</div>
      ) : (
        <div className="inbox-list">
          <h2 style={{fontFamily: 'orbitron'}}>FRIENDS</h2>
          <ul className="list-group">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="list-group-item d-flex align-items-center"
                onClick={() => console.log(`Open chat with ${friend.name}`)}
              >
                <img
                  src={friend.profilePic || '/default-avatar.png'}
                  alt={friend.name}
                  style={{height: '60px', width: '60px'}}
                  className="rounded-circle me-3"
                />
                <strong style={{fontSize: 'small'}}>{friend.name}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    </div>
  );
};

export default Home;


