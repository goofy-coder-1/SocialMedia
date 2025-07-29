import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';
  const token = localStorage.getItem('token');

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState({});
  const [requestedIds, setRequestedIds] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const toggleCommentView = (postId) => {
    setShowAllComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const sendFriendRequest = async (userId) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/friend-request/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(res.data.message);
      setRequestedIds((prev) => [...prev, userId]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/usersprofile/search`, {
          params: { q: query },
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data.users || []);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error('Search failed:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, token]);

  return (
    <div className="container mt-4">
      <h3>Search results for: <strong>{query}</strong></h3>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : users.length === 0 && posts.length === 0 ? (
        <div className="alert alert-warning mt-4">No results found for "{query}".</div>
      ) : (
        <>
          {/* User Results */}
          {users.length > 0 && (
            <>
              <h4 className="mt-4 mb-3">Matching Users:</h4>
              <div className="row">
                {users.map((user) => (
                  <div key={user._id} className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                      <img
                        src={user.profilePic || '/images/default.jpg'}
                        alt={`${user.name}'s avatar`}
                        className="card-img-top"
                        style={{ objectFit: 'cover', height: '200px' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.bio || 'No bio available.'}</p>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => navigate(`/profile/${user._id}`)}
                        >
                          View Profile
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => sendFriendRequest(user._id)}
                          disabled={requestedIds.includes(user._id)}
                        >
                          {requestedIds.includes(user._id) ? 'Request Sent' : 'Send Friend Request'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Post Results */}
          {posts.length > 0 && (
            <>
              <h4 className="mt-5 mb-3">Matching Posts:</h4>
              <div className="row">
                {posts.map((post) => (
                  <div key={post._id} className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-2">
                          <img
                            src={post.author?.profilePic || '/images/default.jpg'}
                            alt={`${post.author?.name}`}
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <h6 className="mb-0">{post.author?.name}</h6>
                        </div>

                        <p>{post.content}</p>

                        <div className="d-flex justify-content-between text-muted small">
                          <span>👍 {post.likes?.length || 0} Likes</span>
                          <span>💬 {post.comments?.length || 0} Comments</span>
                        </div>

                        {/* Comments */}
                        {post.comments && (
                          showAllComments[post._id]
                            ? post.comments.map((comment) => (
                                <div key={comment._id} className="mt-2 border-top pt-2">
                                  <strong>{comment.author?.name}:</strong> {comment.text}
                                </div>
                              ))
                            : post.comments.slice(0, 2).map((comment) => (
                                <div key={comment._id} className="mt-2 border-top pt-2">
                                  <strong>{comment.author?.name}:</strong> {comment.text}
                                </div>
                              ))
                        )}

                        {/* Toggle Button */}
                        {post.comments?.length > 2 && (
                          <button
                            className="btn btn-link btn-sm"
                            onClick={() => toggleCommentView(post._id)}
                          >
                            {showAllComments[post._id] ? 'Hide Comments' : 'View All Comments'}
                          </button>
                        )}

                        <button
                          className="btn btn-outline-primary btn-sm mt-3"
                          onClick={() => navigate(`/profile/${post.author?._id}`)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
