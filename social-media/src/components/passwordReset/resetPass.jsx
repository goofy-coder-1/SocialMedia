import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/users/change-password', { email, newPassword });
      localStorage.setItem('resetEmail', email); // temporarily store for context
      navigate('/verify-code');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending verification code');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Send Verification Code</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default ResetPassword;



