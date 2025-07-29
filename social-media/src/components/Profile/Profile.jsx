import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import '../Profile/Profile.css';
import { UserContext } from '../../contextapi/usercontext';
import { Link } from 'react-router-dom';
import { SlLike } from "react-icons/sl";
import { FiMoreVertical } from "react-icons/fi";

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editPhoto, setEditPhoto] = useState(null);
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const menuRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { user, setUser } = useContext(UserContext);
  const authToken = localStorage.getItem('token');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuPostId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const loadProfileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/usersprofile/profile/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data.user);
      setUserPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  useEffect(() => {
    if (authToken) loadProfileData();
  }, [authToken, setUser]);

  const handleLike = async (postId) => {
    try {
      await axios.put(
        `${BASE_URL}/api/postsapi/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      loadProfileData();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      await axios.post(
        `${BASE_URL}/api/postsapi/posts/${postId}/comment`,
        { text },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      loadProfileData();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditPhoto(null);
  };

  const handleUpdatePost = async () => {
    try {
      const formData = new FormData();
      formData.append('content', editContent);
      if (editPhoto) formData.append('photo', editPhoto);

      await axios.put(
        `${BASE_URL}/api/postsapi/posts/${editingPost._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
        }
      );
      setEditingPost(null);
      setEditContent('');
      setEditPhoto(null);
      loadProfileData();
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/postsapi/posts/${postId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      loadProfileData();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const toggleMenu = (postId) => {
    setOpenMenuPostId(prev => (prev === postId ? null : postId));
  };

  if (!user) return <p>Loading profile details...<br />Make sure to log in</p>;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-image-wrapper">
          <img
            src={user.profilePic || '/images/default.jpg'}
            alt="User avatar"
            className="profile-image"
          />
        </div>

        <div className="profile-info">
          <h2 className="Name">{user.name}</h2>
          <div className="profile-texts">
            <h3 className="username">Call me: {user.username || 'username not set yet'}</h3>
            <h4 className="bio">{user.bio || 'No bio added yet.'}</h4>
            <h4 className="email">Email: {user.email}</h4>
            <h4 className="birthdate">
              Birthdate: {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'Not set'}
            </h4>
          </div>
          <Link to="/update">
            <button className="buttonprofile btn btn-primary">Edit Profile</button>
          </Link>
        </div>
      </div>

      {/* Posts Section */}
      <h3 className="text-center">Posts By User</h3>
      {userPosts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        userPosts.map((post) => (
          <div key={post._id} className="post-card" style={{ position: 'relative' }}>
            {/* Top bar with author & menu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={post.author?.profilePic || '/default-avatar.png'}
                  alt="author"
                  style={{
                    position: 'relative',  // ✅ Needed for absolute menu positioning
                    overflow: 'visible',   // ✅ Ensures dropdown is visible outside
                    zIndex: 1,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '12px',
                  }}
                />
                <h3 style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                  {post.author?.name || 'Unknown Author'}
                </h3>
              </div>

              {/* Three-dot menu */}
              {post.author?._id === user._id && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => toggleMenu(post._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '20px',
                    }}
                  >
                    <FiMoreVertical />
                  </button>

                  {openMenuPostId === post._id && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '30px',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        zIndex: 10,
                      }}
                    >
                      <button
                        onClick={() => {
                          handleEdit(post);
                          setOpenMenuPostId(null);
                        }}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          border: 'none',
                          width: '100%',
                          textAlign: 'left',
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(post._id);
                          setOpenMenuPostId(null);
                        }}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          border: 'none',
                          width: '100%',
                          textAlign: 'left',
                          background: 'white',
                          cursor: 'pointer',
                          color: 'red',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <p>{post.content}</p>
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
            <small>{new Date(post.createdAt).toLocaleString()}</small>

            {/* Like and Comment */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <button
                onClick={() => handleLike(post._id)}
                style={{
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '16px',
                }}
              >
                <SlLike /> {post.likes?.length || 0}
              </button>

              <div style={{ display: 'flex', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post._id] || ''}
                  onChange={(e) =>
                    setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))
                  }
                  style={{
                    padding: '6px 8px',
                    width: '70%',
                    marginRight: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
                <button
                  onClick={() => handleComment(post._id)}
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    backgroundColor: 'blue',
                    color: 'white',
                  }}
                >
                  Comment
                </button>
              </div>
            </div>

            {/* Comments */}
            {post.comments?.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                {(expandedComments[post._id]
                  ? post.comments
                  : post.comments.slice(0, 2)
                ).map((comment, index) => (
                  <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                    <img
                      src={comment.author?.profilePic || '/default-avatar.png'}
                      alt="commenter"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '10px',
                      }}
                    />
                    <div>
                      <strong>{comment.author?.name || 'Unknown'}</strong>
                      <p>{comment.text}</p>
                      <small>{new Date(comment.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                ))}
                {post.comments.length > 2 && (
                  <button
                    className="btn btn-link btn-sm"
                    onClick={() => toggleComments(post._id)}
                  >
                    {expandedComments[post._id] ? 'Hide Comments' : 'View All Comments'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}


      {editingPost && (
        <div className="edit-modal" style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -20%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '500px',
        }}>
          <h4>Edit Post</h4>

          <textarea
            rows="4"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{
              width: '100%',
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />

          {/* Show existing image if no new one selected */}
          {editingPost.photo && !editPhoto && (
            <div style={{ marginBottom: '10px' }}>
              <p>Current Photo:</p>
              <img
                src={editingPost.photo}
                alt="Current"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
            </div>
          )}

          {/* Show preview of new selected image */}
          {editPhoto && (
            <div style={{ marginBottom: '10px' }}>
              <p>New Photo Preview:</p>
              <img
                src={URL.createObjectURL(editPhoto)}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditPhoto(e.target.files[0])}
            style={{ marginBottom: '10px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-primary btn-sm" onClick={handleUpdatePost}>Update</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditingPost(null)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;



