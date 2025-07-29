import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/src/components/Request/friendRequest.css';
import { useFriendContext } from '/src/contextapi/Friendcontext.jsx';

const FriendRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { triggerRefresh } = useFriendContext();

  // Fetch all pending friend requests from the server
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/friend-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch friend requests:', error.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Accept a friend request and trigger inbox refresh
  const acceptRequest = async (userId) => {
    try {
      await axios.post(
        `${BASE_URL}/api/friend-request/accept/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove accepted request from list
      setRequests((prev) => prev.filter((req) => req._id !== userId));
      triggerRefresh(); // Notify Inbox to re-fetch friend list
    } catch (error) {
      console.error('Failed to accept friend request:', error.message);
    }
  };

  // Decline a friend request
  const declineRequest = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/api/friend-request/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove declined request from list
      setRequests((prev) => prev.filter((req) => req._id !== userId));
    } catch (error) {
      console.error('Failed to decline friend request:', error.message);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-4">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container-fluid friend-wrapper">
      <div className="friend-panel">
        <h3 className="text-center">👥 Friend Requests</h3>

        {requests.length === 0 ? (
          <div className="alert alert-secondary mt-3">No pending requests.</div>
        ) : (
          <ul className="list-unstyled">
            {requests.map((request) => (
              <li
                key={request._id}
                className="border rounded p-3 mb-3 bg-light d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={request.profilePic || '/default-avatar.png'}
                    alt="avatar"
                    className="rounded-circle me-3"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  <strong>{request.name}</strong>
                </div>

                <div className="friend-actions">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => acceptRequest(request._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => declineRequest(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendRequest;

