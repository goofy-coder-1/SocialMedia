import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFriendContext } from '/src/contextapi/Friendcontext.jsx';
import '/src/components/Inbox/inbox.css';
import { baseUrl } from '../../../url';

const Inbox = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const { refreshFriends } = useFriendContext();

  useEffect(() => {
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

    setLoading(true); // Show spinner while re-fetching
    fetchFriends();
  }, [refreshFriends]);

  if (loading) {
    return (
      <div className="inbox-container text-center mt-4">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="inbox-container">
      {friends.length === 0 ? (
        <div className="alert alert-secondary mt-3">No friends to message yet.</div>
      ) : (
        <div className="inbox-list">
          <ul className="list-group">
            {friends.map((friend) => (
              <li
              style={{display: 'flex', justifyContent: 'space-between'}}
                key={friend._id}
                className="list-group-item d-flex align-items-center"
                onClick={() => console.log(`Open chat with ${friend.name}`)}
              >
                <div>
                <img
                  src={friend.profilePic || '/default-avatar.png'}
                  alt={friend.name}
                  className="rounded-circle me-3"
                />
                <strong>{friend.name}</strong>
                </div>
                <div>
                <button className='btn btn-primary'>Message</button>
                </div>
              </li>
              
            ))}
           
          </ul>
          
        </div>
      )}
    </div>
  );
};

export default Inbox;

