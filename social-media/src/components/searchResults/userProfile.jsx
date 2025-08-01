import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../searchResults/search.css';
import { baseUrl } from '../../../url';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/usersprofile/profile/${id}`);
        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="user-profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="user-profile-loading">User not found</div>;
  }

  return (
    <div className="user-profile-overlay">
      <div className="user-profile-container">
        <h2>{user.name}</h2>
        <img
          src={user.profilePic || '/images/default.jpg'}
          alt={`${user.name} avatar`}
          className="user-profile-avatar"
        />
        <p>{user.bio || 'No bio provided.'}</p>
        <hr />
        <h3>Posts</h3>
        {posts.length === 0 ? (
          <p>This user hasn’t posted anything yet.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="user-post">
              <p>{post.content}</p>
              <small>Posted on {new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
         <Link to='/'>
      <button className='btn btn-primary'>
        Return Back</button></Link>
      </div>
    </div>
  );
};

export default UserProfile;
