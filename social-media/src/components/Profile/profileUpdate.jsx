// src/components/Profile/ProfileUpdate.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../contextapi/usercontext';
import '../Profile/Profile.css';

const ProfileUpdate = () => {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [birthdate, setBirthdate] = useState(user?.birthdate?.split('T')[0] || '');
  const [profilePic, setProfilePic] = useState(null);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    formData.append('birthdate', birthdate);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      const res = await axios.put(
        'http://localhost:4000/api/usersprofile/profile/update',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setUser(res.data.user);
      alert('Profile updated!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Profile update failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-update-form">
      <label>Call me:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

      <label>Bio:</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

      <label>Birthdate:</label>
      <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />

      <label>Profile Picture:</label>
      <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />

      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ProfileUpdate;

