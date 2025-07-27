// Inbox.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFriendContext } from '/src/contextapi/Friendcontext.jsx'; // adjust the path

const Inbox = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const { refreshFriends } = useFriendContext();

  const fetchFriends = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/friends', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFriends(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch friends failed:', err.message);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true); // to show spinner while re-fetching
    fetchFriends();
  }, [refreshFriends]); // re-fetch when refreshFriends changes

  if (loading) {
    return (
      <div className="container text-center mt-4">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {friends.length === 0 ? (
        <div className="alert alert-secondary mt-3">No friends to message yet.</div>
      ) : (
        <ul className="list-group">
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="list-group-item d-flex align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => console.log(`Open chat with ${friend.name}`)}
            >
              <img
                src={friend.profilePic || '/default-avatar.png'}
                alt={friend.name}
                className="rounded-circle me-3"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
              <strong>{friend.name}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
